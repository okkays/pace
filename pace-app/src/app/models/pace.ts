import {Distance, parseDistance} from './distance';
import {Duration, parseDuration} from './duration';
import {InvalidMetric, Metric} from './metric';

type PaceMetric = Distance|Duration;
type Separator = '/'|' per ';

function getSeparator(rawPace: string): Separator|null {
  if (rawPace.includes('/')) return '/';
  if (rawPace.includes(' per ')) return ' per ';
  return null;
}

/**
 * Attempts to parse both (left and right) metrics.
 *
 * Will return two distance metrics if left and right could both be either
 * distance or duration;
 */
export function parsePace(rawPace: string): Pace|InvalidMetric {
  const separator = getSeparator(rawPace);
  if (separator === null) return new InvalidMetric(null, null);

  const [left, right] = rawPace.split(separator, 2);
  // Because of the bit math below, the compiler can't tell if the following are
  // valid or invalid. We cast because we can tell:
  const leftAsDistance = parseDistance(left) as Distance;
  const leftAsDuration = parseDuration(left) as Duration;
  const rightAsDistance = parseDistance(right) as Distance;
  const rightAsDuration = parseDuration(right) as Duration;

  // Represent whether distance/duration is valid as binary to be able to switch
  // on them easier.
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
    this.unit = [this.left.unit, this.right.unit].join(this.separator);
  }

  toUnit(target: string): Metric|InvalidMetric {
    const targetPace = parsePace(target);
    if (!targetPace.isValid()) return targetPace;
    throw new Error('Method not implemented.');
  }
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
  if (leftValue === null) return null;
  if (rightValue === null) return leftValue;
  return leftValue / rightValue;
}
