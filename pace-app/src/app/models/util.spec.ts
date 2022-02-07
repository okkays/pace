import {getHms, getMs, getUnitText, parseValue, round} from './util';

describe('getUnitText', () => {
  it('should get unit texts', () => {
    expect(getUnitText('full marathon')).toBe('marathon');
    expect(getUnitText('half marathon')).toBe('marathon');
    expect(getUnitText('quarter marathon')).toBe('marathon');
    expect(getUnitText('2 full marathons')).toBe('marathons');
    expect(getUnitText('2 half marathons')).toBe('marathons');
    expect(getUnitText('2 quarter marathons')).toBe('marathons');
    expect(getUnitText('2 marathons')).toBe('marathons');
    expect(getUnitText('2 marathons')).toBe('marathons');
    expect(getUnitText('2 marathons')).toBe('marathons');
  });
});

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

  it('should read special values', () => {
    expect(parseValue('full marathon')).toBe(1);
    expect(parseValue('half marathon')).toBe(0.5);
    expect(parseValue('quarter marathon')).toBe(0.25);
    expect(parseValue('2 full marathon')).toBe(2);
    expect(parseValue('2 half marathon')).toBe(1);
    expect(parseValue('2 quarter marathon')).toBe(0.5);
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
