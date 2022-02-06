import {Distance} from './distance';
import {Duration} from './duration';
import {assertValid, InvalidMetric, Metric} from './metric';
import {Pace} from './pace';

/** Produces the "effort" by doing left for/at right */
export function forOrAt(
    left: Metric|InvalidMetric, right: Metric|InvalidMetric): Metric|
    InvalidMetric {
  if (!left.isValid() || !right.isValid()) {
    return left;
  }
  if (left instanceof Duration) {
    if (right instanceof Duration) {
      // 5 hours for 15 hours doesn't make sense
      return new InvalidMetric(null, left.unit);
    }
    if (right instanceof Distance) {
      // 15min per 3mile is 5 min/mi
      return new Pace(left, ' per ', right);
    }
    if (right instanceof Pace) {
      // 5 hours at 3km/hr is 15km
      return right.times(left);
    }
  }
  if (left instanceof Distance) {
    if (right instanceof Distance) {
      // 5km for 15km doesn't make sense
      return new InvalidMetric(null, left.unit);
    }
    if (right instanceof Duration) {
      // 15km in 5hours is 3km/hour
      return new Pace(left, '/', right);
    }
    if (right instanceof Pace) {
      // 15km at 3km/hr is 5 hours
      return right.times(left);
    }
  }
  if (left instanceof Pace) {
    if (right instanceof Pace) {
      // 3km/hr for 5km/hr doesn't make sense
      return new InvalidMetric(null, left.unit);
    }
    if (right instanceof Duration) {
      // 3km/hr for 5hours is 15km
      return left.times(right);
    }
    if (right instanceof Distance) {
      // 3km/hr for 15km is 5 hours
      return left.times(right);
    }
  }
  return new InvalidMetric(null, left.unit);
}

export function compliment(metric: Metric): Metric[] {
  const duration = new Duration(null, 'minute');
  const distance = new Distance(null, 'meter');
  const pace = new Pace(duration, '/', distance);

  if (metric instanceof Distance) return [duration, pace];
  if (metric instanceof Duration) return [distance, pace];
  if (metric instanceof Pace) return [duration, distance];
  return [];
}

/**
 * Returns a few quick conversions based on a given metric.
 *
 * Follows the good UX advice of trying to read the user's mind.
 */
export function suggest(metric: Metric): Metric[] {
  return suggestFromGroups(metric);
}

// Use '/' as the separate for paces.
const SUGGESTION_GROUPS = [
  // Pace
  ['mile/hour', 'kilometer/hour', 'minute/mile', 'minute/kilometer'],

  // Distance
  ['kilometer', 'mile'],
  ['kilometer', 'meter'],
  ['mile', 'feet'],

  // Duration
  ['hour', 'minute', 'second', 'day'],
];

function getUnitForSuggestions(metric: Metric): string|null {
  if (metric instanceof Distance) return metric.unit;
  if (metric instanceof Duration) return metric.unit;
  if (metric instanceof Pace) {
    return [metric.left.unit, metric.right.unit].join('/');
  }
  return null;
}

function suggestFromGroups(metric: Metric): Metric[] {
  const targetUnit = getUnitForSuggestions(metric);
  console.log(targetUnit);
  if (!targetUnit) return [];
  return SUGGESTION_GROUPS
      .flatMap(group => {
        if (!group.includes(targetUnit)) return [];
        return group.filter(unit => unit !== targetUnit);
      })
      .map(suggestedUnit => metric.toUnit(suggestedUnit))
      .map(assertValid);
}
