import { Distance, parseDistance } from './distance';

describe('Distance', () => {
  it('Should recognize distances', () => {
    expect(parseDistance('1323.03 mile')).toEqual(new Distance(1323.03, 'mile'));

    expect(parseDistance('0 km')).toEqual(new Distance(0, 'kilometer'));
    expect(parseDistance('0 kms')).toEqual(new Distance(0, 'kilometer'));
    expect(parseDistance('0 kilometer')).toEqual(new Distance(0, 'kilometer'));
    expect(parseDistance('0 kilometers')).toEqual(new Distance(0, 'kilometer'));

    expect(parseDistance('1 mis')).toEqual(new Distance(1, 'mile'));
    expect(parseDistance('1 miles')).toEqual(new Distance(1, 'mile'));
    expect(parseDistance('1 mi')).toEqual(new Distance(1, 'mile'));
    expect(parseDistance('1 miles')).toEqual(new Distance(1, 'mile'));

    expect(parseDistance('2 m')).toEqual(new Distance(2, 'meter'));
    expect(parseDistance('2 ms')).toEqual(new Distance(2, 'meter'));
    expect(parseDistance('2 meters')).toEqual(new Distance(2, 'meter'));
    expect(parseDistance('2 meter')).toEqual(new Distance(2, 'meter'));

    expect(parseDistance('3 ft')).toEqual(new Distance(3, 'foot'));
    expect(parseDistance('3 fts')).toEqual(new Distance(3, 'foot'));
    expect(parseDistance('3 foot')).toEqual(new Distance(3, 'foot'));
    expect(parseDistance('3 feet')).toEqual(new Distance(3, 'foot'));
  });

  it('Should convert distances', () => {
    const fromDistance = new Distance(3, 'foot');
    expect(fromDistance.toUnit('meter')).toBeCloseTo(0.9, 1);
    expect(fromDistance.toUnit('foot')).toBeCloseTo(3, 1);
    expect(fromDistance.toUnit('kilometer')).toBeCloseTo(0.0009, 4);
    expect(fromDistance.toUnit('mile')).toBeCloseTo(0.001, 3);
  });

});
