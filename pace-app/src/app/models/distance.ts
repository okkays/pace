import {Metric} from "./metric";

type DistanceUnit = 'mile'|'kilometer'|'meter'|'foot';

export class Distance extends Metric {
  constructor(readonly value: number, readonly unit: DistanceUnit) {
    super();
  }

  private getValueInMeters() {
    if (this.unit === 'meter') return this.value;
    if (this.unit === 'kilometer') return this.value * 1000;
    if (this.unit === 'foot') return this.value * 0.3048;
    if (this.unit === 'mile') return this.value * 1609.344;
    throw new Error(`Unexpected unit: ${this.unit}`);
  }

  toUnit(target: DistanceUnit) {
    const valueInMeters = this.getValueInMeters();
    if (target === 'meter') return valueInMeters;
    if (target === 'kilometer') return valueInMeters / 1000;
    if (target === 'foot') return valueInMeters * 3.2808399;
    if (target === 'mile') return valueInMeters * 0.00062137119;
    throw new Error(`Unexpected unit: ${target}`);
  }
}

export function parseDistance(metric: string): Distance|null {
  const unit = parseUnit(metric);
  const value = parseValue(metric);
  if (unit === null || value === null) return null;
  return new Distance(value, unit);
}

function parseUnit(metric: string): DistanceUnit|null {
  metric = depluralize(metric);

  if (metric.endsWith("mi")) return 'mile';
  if (metric.endsWith("mile")) return 'mile';

  if (metric.endsWith("km")) return 'kilometer';
  if (metric.endsWith("kilometer")) return 'kilometer';

  if (metric.endsWith("m")) return 'meter';
  if (metric.endsWith("meter")) return 'meter';

  if (metric.endsWith("ft")) return 'foot';
  if (metric.endsWith("foot")) return 'foot';

  return null;
}

function parseValue(metric: string): number|null {
  const digitsOnly = metric.replace(/[^\d\.]+/g, '');
  const parsed = Number(digitsOnly);
  if (parsed === NaN) return null;
  return parsed;
}

function depluralize(metric: string): string {
  return metric
    .replace(/feet/g, 'foot')
    .replace(/s$/, '');
}
