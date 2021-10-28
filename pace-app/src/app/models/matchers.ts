import {MaybeMetric, Metric} from './metric';

abstract class MetricMatcher implements jasmine.CustomMatcher {
  compare(
      actual: MaybeMetric, expectedValue: number|null,
      expectedUnit: string): jasmine.CustomMatcherResult {
    if (actual.unit != expectedUnit) {
      return {
        pass: false,
        message: `Expected unit ${expectedUnit}, but got: ${actual.unit}`,
      };
    }
    // The precision here is arbitrary :shrug:
    if (Number(actual.value).toFixed(5) != Number(expectedValue).toFixed(5)) {
      return {
        pass: false,
        message: `Expected value ${expectedValue}, but got: ${actual.value}`,
      };
    }
    return {pass: true};
  }
}

class ValidMetricMatcher extends MetricMatcher {
  compare(
      actual: MaybeMetric, expectedValue: number|null,
      expectedUnit: string): jasmine.CustomMatcherResult {
    if (!actual.isValid()) {
      return {
        pass: false,
        message: 'Metric was unxpectedly invalid',
      };
    }
    return super.compare(actual, expectedValue, expectedUnit);
  }
}

class InvalidMetricMatcher extends MetricMatcher {
  compare(
      actual: MaybeMetric, expectedValue: number|null,
      expectedUnit: string): jasmine.CustomMatcherResult {
    if (actual.isValid()) {
      return {
        pass: false,
        message: 'Metric was unxpectedly valid',
      };
    }
    return super.compare(actual, expectedValue, expectedUnit);
  }
}

export function addMetricMatchers() {
  jasmine.addMatchers({
    toBeMetric: () => new ValidMetricMatcher(),
    toBeInvalidMetric: () => new InvalidMetricMatcher(),
  });
}
