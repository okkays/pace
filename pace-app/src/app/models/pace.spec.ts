import {Distance} from './distance';
import {Duration} from './duration';
import {Pace} from './pace';

const five_minutes = new Duration(5, 'minute');
const two_kilometers = new Distance(2, 'kilometer');

describe('Pace', () => {
  it('has a value of left over right', () => {
    expect(new Pace(five_minutes, '/', two_kilometers).value).toBe(2.5);
  });

  it('has a unit of left seperator right', () => {
    expect(new Pace(five_minutes, '/', two_kilometers).unit)
        .toBe('minute/kilometer');
  });
});
