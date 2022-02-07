import {InvalidMetric, Metric} from './metric';
import {parseValue, round} from './util';

export const DISTANCES = [
  'foot',
  'mile',
  'meter',
  'kilometer',
  'marathon',
  'century',
] as const;

const ABBREVIATIONS: Record<DistanceUnit, string[]> = {
  'mile': ['mi', 'mile'],
  'kilometer': ['km', 'kilometer'],
  'meter': ['m', 'meter'],
  'foot': ['ft', 'foot'],
  'marathon': ['marathon'],
  'century': ['century'],
};

export function abbreviateDistance(metric: DistanceUnit): string[] {
  return [...ABBREVIATIONS[metric]];
}

type DistanceUnit = typeof DISTANCES[number];

export function depluralizeDistance(metric: string): string {
  return metric.replace(/feet/g, 'foot')
      .replace(/centuries/g, 'century')
      .replace(/s$/, '');
}

export function pluralizeDistance(metric: string): string {
  if (['mi', 'ft', 'm', 'km'].includes(metric)) return metric;
  if (metric === 'foot') return 'feet';
  if (metric === 'century') return 'centuries';
  return metric + 's';
}

export class Distance extends Metric {
  constructor(readonly value: number|null, readonly unit: DistanceUnit) {
    super();
  }

  clone(): Distance {
    return new Distance(this.value, this.unit);
  }

  toString(): string {
    const unit = this.isPlural() ? pluralizeDistance(this.unit) : this.unit;
    const value = this.value === null ? '' : `${round(this.value, 2)} `;
    return `${value} ${unit}`;
  }

  withValue(value: number): Distance {
    return new Distance(value, this.unit);
  }

  private getValueInMeters(): number|null {
    if (this.value === null) return null;
    if (this.unit === 'meter') return this.value;
    if (this.unit === 'kilometer') return this.value * 1000;
    if (this.unit === 'foot') return this.value * 0.3048;
    if (this.unit === 'mile') return this.value * 1609.344;
    if (this.unit === 'marathon') return this.value * 42195;
    if (this.unit === 'century') return this.value * 160934;
    throw new Error(`Unexpected unit: ${this.unit}`);
  }

  toUnit(target: DistanceUnit): Distance|InvalidMetric {
    const valueInMeters = this.getValueInMeters();
    if (valueInMeters === null) return new Distance(null, target);
    if (target === 'meter') {
      return new Distance(valueInMeters, 'meter');
    }
    if (target === 'kilometer') {
      return new Distance(valueInMeters / 1000, 'kilometer');
    }
    if (target === 'foot') {
      return new Distance(valueInMeters * 3.2808399, 'foot');
    }
    if (target === 'mile') {
      return new Distance(valueInMeters * 0.00062137119, 'mile');
    }
    if (target === 'marathon') {
      return new Distance(valueInMeters / 42195, 'marathon');
    }
    if (target === 'century') {
      return new Distance(valueInMeters / 160934, 'century');
    }
    return new InvalidMetric(valueInMeters, target);
  }
}

export function parseDistance(metric: string): Distance|InvalidMetric {
  const unit = parseUnit(metric);
  const value = parseValue(metric);
  if (unit === null) return new InvalidMetric(value, unit);
  return new Distance(value, unit);
}

function parseUnit(metric: string): DistanceUnit|null {
  metric = depluralizeDistance(metric);

  if (metric.endsWith('mi')) return 'mile';
  if (metric.endsWith('mile')) return 'mile';

  if (metric.endsWith('km')) return 'kilometer';
  if (metric.endsWith('kilometer')) return 'kilometer';

  if (metric.endsWith('m')) return 'meter';
  if (metric.endsWith('meter')) return 'meter';

  if (metric.endsWith('ft')) return 'foot';
  if (metric.endsWith('foot')) return 'foot';

  if (metric.endsWith('marathon')) return 'marathon';
  if (metric.endsWith('century')) return 'century';

  return null;
}
