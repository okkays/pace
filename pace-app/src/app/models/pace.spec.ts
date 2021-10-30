import {Distance} from './distance';
import {Duration} from './duration';
import {addMetricMatchers} from './matchers';
import {assertValid} from './metric';
import {Pace, parsePace} from './pace';

const TEN_MINS = new Duration(10, 'minute');
const ONE_MILE = new Distance(1, 'mile');
const TWO_KMS = new Distance(2, 'kilometer');
const TEN_MINS_PER_MILE = new Pace(TEN_MINS, '/', ONE_MILE);
const KMS_PER_MIN = new Pace(
    new Distance(null, 'kilometer'), '/', new Duration(null, 'minute'));

describe('Pace', () => {
  beforeEach(addMetricMatchers);

  it('has a value of left over right', () => {
    expect(new Pace(TEN_MINS, '/', TWO_KMS).value).toBe(5);
  });

  it('has a unit of left seperator right', () => {
    expect(new Pace(TEN_MINS, '/', TWO_KMS).unit).toBe('minute/kilometer');
  });

  it('converts distance/duration to duration/distance', () => {
    (expect(TEN_MINS_PER_MILE.toUnit('mi/h')) as any)
        .toBeMetric(6, 'mile/hour');
  });

  it('converts to *p*', () => {
    (expect(TEN_MINS_PER_MILE.toUnit('mph')) as any).toBeMetric(6, 'mph');
  });

  it('converts distances', () => {
    (expect(TEN_MINS_PER_MILE.toUnit('min/km')) as any)
        .toBeMetric(6.213712, 'minute/kilometer');
  });

  it('converts durations', () => {
    (expect(TEN_MINS_PER_MILE.toUnit('secs/mi')) as any)
        .toBeMetric(10 * 60, 'second/mile');
  });

  it('handles invalid conversions', () => {
    (expect(TEN_MINS_PER_MILE.toUnit('mi')) as any)
        .toBeInvalidMetric(null, null);
  });

  it('handles valueless conversions', () => {
    (expect(KMS_PER_MIN.toUnit('min/mi')) as any)
        .toBeMetric(null, 'minute/mile');
  });

  it('balks at conversions to values', () => {
    (expect(KMS_PER_MIN.toUnit('5 min/mi')) as any)
        .toBeInvalidMetric(null, null);
  });
});

describe('parsePace', () => {
  beforeEach(addMetricMatchers);

  it('parses a single-value pace', () => {
    (expect(parsePace('5 min/km')) as any).toBeMetric(5, 'minute/kilometer');
  });

  it('recognizes mph and kph', () => {
    (expect(parsePace('5 kph')) as any).toBeMetric(5, 'kph');
    (expect(parsePace('5 mph')) as any).toBeMetric(5, 'mph');
  });

  it('recognizes units of [km]p[wdhms]', () => {
    expect(assertValid(parsePace('5 kph')).left.unit).toBe('kilometer');
    expect(assertValid(parsePace('5 mph')).left.unit).toBe('mile');
    expect(assertValid(parsePace('5 mpw')).right.unit).toBe('week');
    expect(assertValid(parsePace('5 mpd')).right.unit).toBe('day');
    expect(assertValid(parsePace('5 mph')).right.unit).toBe('hour');
    expect(assertValid(parsePace('5 mpm')).right.unit).toBe('minute');
    expect(assertValid(parsePace('5 mps')).right.unit).toBe('second');
  });

  it('parses a two-valued pace', () => {
    (expect(parsePace('5 min/2 km')) as any)
        .toBeMetric(2.5, 'minute/kilometer');
  });

  it('handles different separators', () => {
    (expect(parsePace('5 min/2km')) as any).toBeMetric(2.5, 'minute/kilometer');
    (expect(parsePace('5 min per 2km')) as any)
        .toBeMetric(2.5, 'minute per kilometer');
  });


  it('handles invalid metric units', () => {
    (expect(parsePace('foo/foo')) as any).toBeInvalidMetric(null, null);
    (expect(parsePace('foo/mile')) as any).toBeInvalidMetric(null, null);
    (expect(parsePace('min/foo')) as any).toBeInvalidMetric(null, null);
    (expect(parsePace('min/min')) as any).toBeInvalidMetric(null, null);
    (expect(parsePace('mile/mile')) as any).toBeInvalidMetric(null, null);
  });

  it('handles valid metric units', () => {
    (expect(parsePace('min/mile')) as any).toBeMetric(null, 'minute/mile');
    (expect(parsePace('mile/min')) as any).toBeMetric(null, 'mile/minute');
  });
});
