import {InvalidMetric, Metric} from './metric';
import {parseValue} from './util';

type DurationUnit = 'hour'|'minute'|'second'|'day'|'week'|'month';

export class Duration extends Metric {
  constructor(readonly value: number|null, readonly unit: DurationUnit) {
    super();
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

export function parseDuration(metric: string): Duration|InvalidMetric {
  const unit = parseUnit(metric);
  const value = parseValue(metric);
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

  if (metric.match(/^[^A-Za-z]*days?$/)) return 'day';

  if (metric.match(/^[^A-Za-z]*weeks?$/)) return 'week';
  if (metric.match(/^[^A-Za-z]*wks?$/)) return 'week';

  if (metric.match(/^[^A-Za-z]*months?$/)) return 'month';

  return null;
}
