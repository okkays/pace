import {parseValue, round} from './util';

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

describe('round', () => {
  it('should round to two digits', () => {
    expect(round(123.45678, 2)).toBe(123.46);
    expect(round(123.45378, 2)).toBe(123.45);
    expect(round(123, 2)).toBe(123);
    expect(round(123.1, 2)).toBe(123.1);
  });
});
