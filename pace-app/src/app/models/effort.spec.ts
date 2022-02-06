import {Distance, parseDistance} from './distance';
import {Duration, parseDuration} from './duration';
import {compliment, forOrAt, suggest, SUGGESTION_GROUPS} from './effort';
import {assertValid, InvalidMetric} from './metric';
import {Pace, parsePace} from './pace';
import {parseMetrics} from './parsers';

describe('forOrAt', () => {
  it('should not accept duration squared', () => {
    expect(forOrAt(parseDuration('3 hours'), parseDuration('3 hours')))
        .toBeInstanceOf(InvalidMetric);
  });
  it('should not accept distance squared', () => {
    expect(forOrAt(parseDistance('3 miles'), parseDistance('3 miles')))
        .toBeInstanceOf(InvalidMetric);
  });
  it('should not accept pace squared', () => {
    expect(forOrAt(parsePace('3 kph'), parsePace('3 kph')))
        .toBeInstanceOf(InvalidMetric);
  });

  it('should accept duration for distance', () => {
    expect(forOrAt(parseDuration('3 hours'), parseDistance('15 km')))
        .toEqual(parsePace('3 hours per 15 km'));
  });
  it('should accept distance in duration', () => {
    expect(forOrAt(parseDistance('5 km'), parseDuration('3 hours')))
        .toEqual(parsePace('5 km/3 hours'));
  });

  it('should accept duration at pace', () => {
    expect(forOrAt(parseDuration('3 hours'), parsePace('5kph')))
        .toEqual(parseDistance('15km'));
  });
  it('should accept distance at pace', () => {
    expect(forOrAt(parseDistance('15km'), parsePace('5kph')))
        .toEqual(parseDuration('3 hours'));
  });
  it('should accept pace for duration', () => {
    expect(forOrAt(parsePace('5kph'), parseDuration('3 hours')))
        .toEqual(parseDistance('15km'));
  });
  it('should accept pace for distance', () => {
    expect(forOrAt(parsePace('5kph'), parseDistance('15km')))
        .toEqual(parseDuration('3 hours'));
  });
});

const EMPTY_DURATION = new Duration(null, 'minute');
const EMPTY_DISTANCE = new Distance(null, 'meter');
const EMPTY_PACE = new Pace(EMPTY_DURATION, '/', EMPTY_DISTANCE);

describe('forOrAt', () => {
  it('should compliment durations', () => {
    expect(compliment(EMPTY_DURATION)).toEqual([EMPTY_DISTANCE, EMPTY_PACE]);
    expect(compliment(EMPTY_DISTANCE)).toEqual([EMPTY_DURATION, EMPTY_PACE]);
    expect(compliment(EMPTY_PACE)).toEqual([EMPTY_DURATION, EMPTY_DISTANCE]);
  });
});

describe('suggestFromGroups', () => {
  it('should convert between suggested groups', () => {
    const baseMetric = assertValid(parseDistance('5 km'));
    expect(suggest(baseMetric)).toEqual([
      assertValid(baseMetric.toUnit('mile')),
      assertValid(baseMetric.toUnit('meter')),
    ]);
  });

  it('handles pace separators correctly', () => {
    const baseMetric = assertValid(parsePace('5 kph'));
    expect(suggest(baseMetric)).toEqual([
      assertValid(baseMetric.toUnit('mile/hour')),
      assertValid(baseMetric.toUnit('minute/mile')),
      assertValid(baseMetric.toUnit('minute/kilometer')),
    ]);
  });

  it('handles paces correctly', () => {
    const baseMetric = assertValid(parsePace('1 kilometer/hour'));
    expect(suggest(baseMetric)).toEqual([
      assertValid(baseMetric.toUnit('mile/hour')),
      assertValid(baseMetric.toUnit('minute/mile')),
      assertValid(baseMetric.toUnit('minute/kilometer')),
    ]);
  });

  it('only uses valid metrics', () => {
    const metrics =
        SUGGESTION_GROUPS.flat().flatMap(unit => parseMetrics(unit));
    for (const metric of metrics) {
      expect(metric.isValid()).withContext(String(metric.unit)).toBeTrue();
    }
  });
});
