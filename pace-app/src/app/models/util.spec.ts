import {getHms, getMs, parseValue, round} from './util';

describe('parseValue', () => {
  it('should read ints', () => {
    expect(parseValue('123')).toBe(123);
  });

  it('should read ints with extra characters', () => {
    expect(parseValue('foo123 bar')).toBe(123);
  });

  it('should read float', () => {
    expect(parseValue('123.4')).toBe(123.4);
  });

  it('should fail on bad floats', () => {
    expect(parseValue('123.4.5')).toBeNull();
  });

  it('should fail with no digits', () => {
    expect(parseValue('foo')).toBeNull();
  });
});

describe('getMs', () => {
  it('should get minutes:seconds', () => {
    expect(getMs(66.5)).toBe('66:30');
  });
  it('should drop seconds when 0', () => {
    expect(getMs(66)).toBe('66');
  });
  it('should drop leading zero when no seconds', () => {
    expect(getMs(6)).toBe('6');
  });
});

describe('getHms', () => {
  it('should get hours:minutes:seconds', () => {
    expect(getHms(66.5)).toBe('01:06:30');
  });
  it('should drop minutes and seconds when 0', () => {
    expect(getHms(120)).toBe('2');
  });
  it('should only drop minutes and seconds when both 0', () => {
    expect(getHms(120.5)).toBe('02:00:30');
    expect(getHms(123)).toBe('02:03:00');
  });
});

describe('round', () => {
  it('should round to two digits', () => {
    expect(round(123.45678, 2)).toBe(123.46);
    expect(round(123.45378, 2)).toBe(123.45);
    expect(round(123, 2)).toBe(123);
    expect(round(123.1, 2)).toBe(123.1);
  });
});
