export abstract class Metric {
  abstract readonly value: number|null;
  abstract readonly unit: string;
  abstract toUnit(target: string): Metric;
  isValid(): this is Metric {
    return true;
  }
}

export class InvalidMetric {
  constructor(readonly value: number|null, readonly unit: string|null) {}
  toString(): string {
    return `Invalid metric with value '${this.value}' and unit '${this.unit}'`;
  }
  isValid(): this is Metric {
    return false;
  }
}
