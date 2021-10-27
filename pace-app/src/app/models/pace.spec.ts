import {Distance} from './distance';
import {Duration} from './duration';
import {addMetricMatchers} from './matchers';
import {Pace, parsePace} from './pace';

const FIVE_MINUTES = new Duration(5, 'minute');
const TWO_KILOMETERS = new Distance(2, 'kilometer');

describe('Pace', () => {
  it('has a value of left over right', () => {
    expect(new Pace(FIVE_MINUTES, '/', TWO_KILOMETERS).value).toBe(2.5);
  });

  it('has a unit of left seperator right', () => {
    expect(new Pace(FIVE_MINUTES, '/', TWO_KILOMETERS).unit)
        .toBe('minute/kilometer');
  });
});

describe('parsePace', () => {
  beforeEach(addMetricMatchers);

  it('parses a single-value pace', () => {
    (expect(parsePace('5 min/km')) as any).toBeMetric(5, 'minute/kilometer');
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
