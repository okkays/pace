import {InvalidMetric, Metric} from './metric';
import {parseValue} from './util';

type DistanceUnit = 'mile'|'kilometer'|'meter'|'foot';

export class Distance extends Metric {
  constructor(readonly value: number|null, readonly unit: DistanceUnit) {
    super();
  }

  private getValueInMeters(): number|null {
    if (this.value === null) return null;
    if (this.unit === 'meter') return this.value;
    if (this.unit === 'kilometer') return this.value * 1000;
    if (this.unit === 'foot') return this.value * 0.3048;
    if (this.unit === 'mile') return this.value * 1609.344;
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
  metric = depluralize(metric);

  if (metric.endsWith('mi')) return 'mile';
  if (metric.endsWith('mile')) return 'mile';

  if (metric.endsWith('km')) return 'kilometer';
  if (metric.endsWith('kilometer')) return 'kilometer';

  if (metric.endsWith('m')) return 'meter';
  if (metric.endsWith('meter')) return 'meter';

  if (metric.endsWith('ft')) return 'foot';
  if (metric.endsWith('foot')) return 'foot';

  return null;
}

function depluralize(metric: string): string {
  return metric.replace(/feet/g, 'foot').replace(/s$/, '');
}
