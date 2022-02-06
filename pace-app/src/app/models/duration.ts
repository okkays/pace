import {InvalidMetric, Metric} from './metric';
import {parseHms, parseValue, round} from './util';

export const DURATIONS = [
  'second',
  'minute',
  'hour',
  'day',
  'week',
  'month',
] as const;

const ABBREVIATIONS: Record<DurationUnit, string[]> = {
  'second': ['second', 'sec', 's'],
  'minute': ['minute', 'min', 'm'],
  'hour': ['hour', 'hr', 'h'],
  'day': ['d', 'day'],
  'week': ['week', 'wk', 'w'],
  'month': ['month'],
};

export function abbreviateDuration(metric: DurationUnit): string[] {
  return [...ABBREVIATIONS[metric]];
}

type DurationUnit = typeof DURATIONS[number];

export function depluralizeDuration(metric: string): string {
  return metric.replace(/s$/, '');
}

export function pluralizeDuration(metric: string): string {
  if (['w', 'h', 'd', 's', 'm', 'min'].includes(metric)) return metric;
  return metric + 's';
}

export class Duration extends Metric {
  constructor(readonly value: number|null, readonly unit: DurationUnit) {
    super();
  }

  clone(): Duration {
    return new Duration(this.value, this.unit);
  }

  toString(): string {
    const unit = this.isPlural() ? pluralizeDuration(this.unit) : this.unit;
    const value = this.value === null ? '' : `${round(this.value, 2)} `;
    return `${value} ${unit}`;
  }

  withValue(value: number): Duration {
    return new Duration(value, this.unit);
  }

  private getValueInSeconds(): number|null {
    if (this.value === null) return null;
    if (this.unit === 'second') return this.value;
    if (this.unit === 'minute') return this.value * 60;
    if (this.unit === 'hour') return this.value * 60 * 60;
    if (this.unit === 'day') return this.value * 60 * 60 * 24;
    if (this.unit === 'week') return this.value * 60 * 60 * 24 * 7;
    if (this.unit === 'month') return this.value * 60 * 60 * 24 * 7 * 30.5;
    throw new Error(`Unexpected unit: ${this.unit}`);
  }

  toUnit(target: DurationUnit): Duration|InvalidMetric {
    const valueInSeconds = this.getValueInSeconds();
    if (valueInSeconds === null) return new Duration(null, target);
    if (target === 'second') {
      return new Duration(valueInSeconds, 'second');
    }
    if (target === 'minute') {
      return new Duration(valueInSeconds / 60, 'minute');
    }
    if (target === 'hour') {
      return new Duration(valueInSeconds / (60 * 60), 'hour');
    }
    if (target === 'day') {
      return new Duration(valueInSeconds / (60 * 60 * 24), 'day');
    }
    if (target === 'week') {
      return new Duration(valueInSeconds / (60 * 60 * 24 * 7), 'week');
    }
    if (target === 'month') {
      return new Duration(valueInSeconds / (60 * 60 * 24 * 7 * 30.5), 'month');
    }
    return new InvalidMetric(this.value, target);
  }
}

function parseDurationValue(value: string, unit: DurationUnit|null): number|
    null {
  if (value.includes(':')) {
    if (unit === null) return null;
    const seconds = new Duration(parseHms(value), 'second');
    return seconds.toUnit(unit).value;
  }
  return parseValue(value);
}

export function parseDuration(metric: string): Duration|InvalidMetric {
  const unit = parseUnit(metric);
  const value = parseDurationValue(metric, unit);
  if (unit === null) return new InvalidMetric(value, unit);
  return new Duration(value, unit);
}

function parseUnit(metric: string): DurationUnit|null {
  if (metric.match(/^[^A-Za-z]*seconds?$/)) return 'second';
  if (metric.match(/^[^A-Za-z]*secs?$/)) return 'second';
  if (metric.match(/^[^A-Za-z]*s$/)) return 'second';

  if (metric.match(/^[^A-Za-z]*minutes?$/)) return 'minute';
  if (metric.match(/^[^A-Za-z]*mins?$/)) return 'minute';
  if (metric.match(/^[^A-Za-z]*m$/)) return 'minute';

  if (metric.match(/^[^A-Za-z]*hours?$/)) return 'hour';
  if (metric.match(/^[^A-Za-z]*hrs?$/)) return 'hour';
  if (metric.match(/^[^A-Za-z]*hs?$/)) return 'hour';

  if (metric.match(/^[^A-Za-z]*d?$/)) return 'day';
  if (metric.match(/^[^A-Za-z]*days?$/)) return 'day';

  if (metric.match(/^[^A-Za-z]*weeks?$/)) return 'week';
  if (metric.match(/^[^A-Za-z]*wks?$/)) return 'week';
  if (metric.match(/^[^A-Za-z]*w?$/)) return 'week';

  if (metric.match(/^[^A-Za-z]*months?$/)) return 'month';

  return null;
}
