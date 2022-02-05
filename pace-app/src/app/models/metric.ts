export abstract class BaseMetric {
  abstract readonly value: number|null;
  abstract readonly unit: string|null;
  abstract isValid(): this is Metric;

  isPlural(): boolean {
    return this.value !== 1;
  }
}

export abstract class Metric extends BaseMetric {
  abstract toUnit(target: string): Metric|InvalidMetric;
  isValid(): this is Metric {
    return true;
  }
}

export class InvalidMetric extends BaseMetric {
  constructor(readonly value: number|null, readonly unit: string|null) {
    super();
  }
  toString(): string {
    return `Invalid metric with value '${this.value}' and unit '${this.unit}'`;
  }
  isValid(): this is Metric {
    return false;
  }
}

export type MaybeMetric = Metric|InvalidMetric;

export function assertValid<T extends Metric>(metric: T|InvalidMetric): T {
  if (!metric.isValid()) throw new TypeError('Metric must be valid');
  return metric;
}
