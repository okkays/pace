import {abbreviateDistance, Distance, DISTANCES, parseDistance, pluralizeDistance} from './distance';
import {abbreviateDuration, Duration, DURATIONS, parseDuration, pluralizeDuration} from './duration';
import {InvalidMetric, Metric} from './metric';

type PaceMetric = Distance|Duration;

export const PACES: string[] = [];

const PLURAL_PACES = new Map<string, string>();

for (const distance of DISTANCES.map(abbreviateDistance).flat()) {
  for (const duration of DURATIONS.map(abbreviateDuration).flat()) {
    for (const separator of ['/', ' per ']) {
      const distanceFirst = `${distance}${separator}${duration}`;
      const distanceFirstPlural =
          `${pluralizeDistance(distance)}${separator}${duration}`;
      const durationFirst = `${duration}${separator}${distance}`;
      const durationFirstPlural =
          `${pluralizeDuration(duration)}${separator}${distance}`;
      PACES.push(distanceFirst);
      PACES.push(durationFirst);
      PLURAL_PACES.set(distanceFirst, distanceFirstPlural);
      PLURAL_PACES.set(durationFirst, durationFirstPlural);
    }
  }
}

for (const specialDistance of ['k', 'm']) {
  for (const specialDuration of ['w', 'd', 'h', 'm', 's']) {
    const specialPace = `${specialDistance}p${specialDuration}`;
    PACES.push(specialPace);
    PLURAL_PACES.set(specialPace, specialPace);
  }
}

export function pluralizePace(metric: string): string|null {
  return PLURAL_PACES.get(metric) || null;
}

type Separator = '/'|' per '|'p';
const P_REGEX = /^(?<value>[^A-Za-z]*)(?<distance>[km])p(?<duration>[wdhms])$/

function getSeparator(rawPace: string): Separator|null {
  if (rawPace.includes('/')) return '/';
  if (rawPace.includes(' per ')) return ' per ';
  return null;
}

function parseSpecialPace(rawPace: string): Pace|InvalidMetric {
  const pMatch = rawPace.match(P_REGEX);
  const pGroups = pMatch?.groups;
  if (!pGroups) return new InvalidMetric(null, null);
  const value = pGroups['value'];
  const rawDistance = pGroups['distance'];
  let distance: Distance|InvalidMetric;
  switch (rawDistance) {
    case 'k':
      distance = parseDistance(value + 'kilometer');
      break;
    case 'm':
      distance = parseDistance(value + 'mile');
      break;
    default:
      return new InvalidMetric(null, null);
  }
  if (!distance.isValid()) return new InvalidMetric(null, null);

  const rawDuration = pGroups['duration'];
  const duration = parseDuration(rawDuration);
  if (!duration.isValid()) return new InvalidMetric(null, null);

  return new Pace(distance, 'p', duration);
}

/**
 * Attempts to parse both (left and right) metrics.
 *
 * Will return two distance metrics if left and right could both be either
 * distance or duration;
 */
export function parsePace(rawPace: string): Pace|InvalidMetric {
  const maybeSpecialPace = parseSpecialPace(rawPace);
  if (maybeSpecialPace.isValid()) return maybeSpecialPace;

  const separator = getSeparator(rawPace);
  if (separator === null) return new InvalidMetric(null, null);

  const [left, right] = rawPace.split(separator, 2);
  // Because of the bit math below, the compiler can't tell if the following
  // are valid or invalid. We cast because we can tell:
  const leftAsDistance = parseDistance(left) as Distance;
  const leftAsDuration = parseDuration(left) as Duration;
  const rightAsDistance = parseDistance(right) as Distance;
  const rightAsDuration = parseDuration(right) as Duration;

  // Represent whether distance/duration is valid as binary to be able to
  // switch on them easier.
  const states: number =
      (Number(leftAsDistance.isValid()) << 3 |
       Number(leftAsDuration.isValid()) << 2 |
       Number(rightAsDistance.isValid()) << 1 |
       Number(rightAsDuration.isValid()));

  const leftAsInvalid = new InvalidMetric(leftAsDistance.value, null);
  const rightAsInvalid = new InvalidMetric(rightAsDistance.value, null);

  switch (states) {
    // Left (isDistance, isDuration), Right (isDistance, isDuration)
    case 0b0000:
      return new InvalidPace(leftAsInvalid, separator, rightAsInvalid);
    case 0b0001:
      return new InvalidPace(leftAsInvalid, separator, rightAsDuration);
    case 0b0010:
      return new InvalidPace(leftAsInvalid, separator, rightAsDistance);
    case 0b0011:
      return new InvalidPace(leftAsInvalid, separator, rightAsDistance);
    case 0b0100:
      return new InvalidPace(leftAsDuration, separator, rightAsInvalid);
    case 0b0101:
      return new InvalidPace(leftAsDuration, separator, rightAsDuration);
    case 0b0110:
      return new Pace(leftAsDuration, separator, rightAsDistance);
    case 0b0111:
      return new Pace(leftAsDuration, separator, rightAsDistance);
    case 0b1000:
      return new InvalidPace(leftAsDistance, separator, rightAsInvalid);
    case 0b1001:
      return new Pace(leftAsDistance, separator, rightAsDuration);
    case 0b1010:
      return new InvalidPace(leftAsDistance, separator, rightAsDistance);
    case 0b1011:
      return new Pace(leftAsDistance, separator, rightAsDuration);
    case 0b1100:
      return new InvalidPace(leftAsDistance, separator, rightAsInvalid);
    case 0b1101:
      return new Pace(leftAsDistance, separator, rightAsDuration);
    case 0b1110:
      return new Pace(leftAsDuration, separator, rightAsDistance);
    case 0b1111:
      return new InvalidPace(leftAsDistance, separator, rightAsDistance);
    default:
      throw new RangeError(
          'Illegal comparison state: expected a four bit integer, but got: ' +
          Number(states).toString(2));
  }
}

export class Pace extends Metric {
  readonly unit: string;
  readonly value: number|null;

  constructor(
      readonly left: PaceMetric,
      readonly separator: Separator,
      readonly right: PaceMetric,
  ) {
    super();
    this.value = getValue(left.value, right.value);
    if (this.separator === 'p') {
      this.unit = `${this.left.unit.charAt(0)}p${this.right.unit.charAt(0)}`;
    } else {
      this.unit = [this.left.unit, this.right.unit].join(this.separator);
    }
  }

  toString(): string {
    const unit = this.isPlural() ? pluralizePace(this.unit) : this.unit;
    const value = this.value === null ? '' : `${this.value} `;
    return `${value}${unit}`;
  }

  /**
   * Transforms this pace into another pace, which may invole:
   * - swapping ratio (min/km to km/min)
   * - changing distance unit (km to mi)
   * - changing duration unit (min to hr)
   */
  toUnit(target: string): Metric|InvalidMetric {
    const targetPace = parsePace(target);
    if (!targetPace.isValid()) return new InvalidMetric(null, null);
    if (targetPace.value !== null) return new InvalidMetric(null, null);
    if (this.value === null) return targetPace;

    let originalLeft = this.left.withValue(this.left.value || 1);
    let originalRight = this.right.withValue(this.right.value || 1);

    const isSwap =
        ((targetPace.left instanceof Duration &&
          !(originalLeft instanceof Duration)) ||
         (targetPace.left instanceof Distance &&
          !(originalLeft instanceof Distance)));

    if (isSwap) {
      [originalLeft, originalRight] = [originalRight, originalLeft];
    }

    const left = convertPaceMetric(originalLeft, targetPace.left);
    const right = convertPaceMetric(originalRight, targetPace.right);

    if (!left.isValid() || !right.isValid()) {
      return new InvalidPace(left, this.separator, right);
    }

    return new Pace(left, targetPace.separator, right);
  }
}

function convertPaceMetric(original: PaceMetric, target: PaceMetric) {
  if (original instanceof Distance && target instanceof Distance) {
    return original.toUnit(target.unit);
  }
  if (original instanceof Duration && target instanceof Duration) {
    console.log('boop', original, target, original.toUnit(target.unit).value);
    return original.toUnit(target.unit);
  }
  return new InvalidMetric(null, null);
}

export class InvalidPace extends InvalidMetric {
  readonly reason: string;

  determineReason(): string {
    if (this.left.isValid() && this.right.isValid()) {
      let kind: string|undefined;
      if (this.left instanceof Distance) kind = 'distance';
      if (this.left instanceof Duration) kind = 'duration';
      return `Both paces could be a ${kind}`;
    }
    const failures = [];
    if (!this.left.isValid()) failures.push('left');
    if (!this.right.isValid()) failures.push('right');
    const unitWord = failures.length == 1 ? 'unit' : 'units';
    return `couldn't understand the ${failures.join(' or ')} ${unitWord}`;
  }

  constructor(
      readonly left: PaceMetric|InvalidMetric,
      readonly separator: Separator,
      readonly right: PaceMetric|InvalidMetric,
  ) {
    super(getValue(left.value, right.value), null);
    this.reason = this.determineReason();
  }

  toString(): string {
    return `${this.reason} (${this.left}${this.separator}${this.right})`;
  }
}

function getValue(leftValue: number|null, rightValue: number|null): number|
    null {
  if (leftValue === null && rightValue == null) return null;
  if (rightValue === null) return leftValue;
  if (leftValue === null) return 1 / rightValue;
  return leftValue / rightValue;
}
