import { parseValue } from './util';

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
