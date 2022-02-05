import {parseDistance} from './distance';
import {parseDuration} from './duration';
import {forOrAt} from './effort';
import {InvalidMetric} from './metric';
import {Pace, parsePace} from './pace';

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
