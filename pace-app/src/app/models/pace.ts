import {Distance, parseDistance} from './distance';
import {Duration} from './duration';
import {InvalidMetric, Metric} from './metric';

type PaceMetric = Distance|Duration|InvalidMetric;
type Separator = '/'|' per ';

function getSplitter(rawPace: string): Separator|null {
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
function parseMetrics(rawPace: string): [PaceMetric, PaceMetric] {
  const splitter = getSplitter(rawPace);
  if (splitter === null)
    return [new InvalidMetric(null, null), new InvalidMetric(null, null)];

  const [left, right] = rawPace.split(splitter, 2);
  const leftAsDistance = parseDistance(left);
  const leftAsDuration = parseDistance(left);
  const rightAsDistance = parseDistance(right);
  const rightAsDuration = parseDistance(right);

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
      return [leftAsInvalid, rightAsInvalid];
    case 0b0001:
      return [leftAsInvalid, rightAsDuration];
    case 0b0010:
      return [leftAsInvalid, rightAsDistance];
    case 0b0011:
      return [leftAsInvalid, rightAsDistance];
    case 0b0100:
      return [leftAsDuration, rightAsInvalid];
    case 0b0101:
      return [leftAsDuration, rightAsDuration];
    case 0b0110:
      return [leftAsDuration, rightAsDistance];
    case 0b0111:
      return [leftAsDuration, rightAsDistance];
    case 0b1000:
      return [leftAsDistance, rightAsInvalid];
    case 0b1001:
      return [leftAsDistance, rightAsDuration];
    case 0b1010:
      return [leftAsDistance, rightAsDistance];
    case 0b1011:
      return [leftAsDistance, rightAsDuration];
    case 0b1100:
      return [leftAsDistance, rightAsInvalid];
    case 0b1101:
      return [leftAsDistance, rightAsDuration];
    case 0b1110:
      return [leftAsDuration, rightAsDistance];
    case 0b1111:
      return [leftAsDistance, rightAsDistance];
    default:
      throw new RangeError(
          'Illegal comparison state: expected a four bit integer, but got: ' +
          Number(states).toString(2));
  }
}

export class Pace extends Metric {
  get value(): number|null {
    if (this.left.value === null || this.right.value === null) return null;
    return this.left.value / this.right.value;
  }

  get unit(): string {
    return this.left.unit + this.separator + this.right.unit;
  }

  constructor(
      readonly left: PaceMetric,
      readonly separator: Separator,
      readonly right: PaceMetric,
  ) {
    super();
  }

  toUnit(target: string): Metric {
    throw new Error('Method not implemented.');
  }
}
