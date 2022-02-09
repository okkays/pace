import {Duration, parseDuration} from './duration';

describe('Duration', () => {
  it('Should recognize durations', () => {
    expect(parseDuration('12:34 seconds'))
        .toEqual(new Duration((12 * 60) + 34, 'second'));
    expect(parseDuration('12:30 minutes'))
        .toEqual(new Duration(12.5, 'minute'));
    expect(parseDuration('11:30:00 hours')).toEqual(new Duration(11.5, 'hour'));

    expect(parseDuration('1323.03 seconds'))
        .toEqual(new Duration(1323.03, 'second'));

    expect(parseDuration('0 s')).toEqual(new Duration(0, 'second'));
    expect(parseDuration('0 sec')).toEqual(new Duration(0, 'second'));
    expect(parseDuration('0 secs')).toEqual(new Duration(0, 'second'));
    expect(parseDuration('0 second')).toEqual(new Duration(0, 'second'));
    expect(parseDuration('0 seconds')).toEqual(new Duration(0, 'second'));

    expect(parseDuration('0 minute')).toEqual(new Duration(0, 'minute'));
    expect(parseDuration('0 min')).toEqual(new Duration(0, 'minute'));
    expect(parseDuration('0 minutes')).toEqual(new Duration(0, 'minute'));
    expect(parseDuration('0 mins')).toEqual(new Duration(0, 'minute'));

    expect(parseDuration('0 hour')).toEqual(new Duration(0, 'hour'));
    expect(parseDuration('0 hr')).toEqual(new Duration(0, 'hour'));
    expect(parseDuration('0 h')).toEqual(new Duration(0, 'hour'));
    expect(parseDuration('0 hours')).toEqual(new Duration(0, 'hour'));
    expect(parseDuration('0 hrs')).toEqual(new Duration(0, 'hour'));
    expect(parseDuration('0 hs')).toEqual(new Duration(0, 'hour'));

    expect(parseDuration('0 d')).toEqual(new Duration(0, 'day'));
    expect(parseDuration('0 day')).toEqual(new Duration(0, 'day'));
    expect(parseDuration('0 days')).toEqual(new Duration(0, 'day'));

    expect(parseDuration('0 w')).toEqual(new Duration(0, 'week'));
    expect(parseDuration('0 week')).toEqual(new Duration(0, 'week'));
    expect(parseDuration('0 weeks')).toEqual(new Duration(0, 'week'));

    expect(parseDuration('0 month')).toEqual(new Duration(0, 'month'));
    expect(parseDuration('0 months')).toEqual(new Duration(0, 'month'));
  });

  it('Should handle invalid Durations', () => {
    expect(parseDuration('0 foos').isValid()).toBeFalse();
  });

  it('Should handle valueless Durations', () => {
    expect(parseDuration('minutes').isValid()).toBeTrue();
    expect(parseDuration('minutes').unit).toBe('minute');
  });

  it('Should convert duration values', () => {
    const fromDuration = new Duration(3, 'hour');
    expect(fromDuration.toUnit('second').value).toBe(3 * 60 * 60);
    expect(fromDuration.toUnit('minute').value).toBe(3 * 60);
    expect(fromDuration.toUnit('hour').value).toBe(3);
    expect(fromDuration.toUnit('day').value).toBe(3 / 24);
    expect(fromDuration.toUnit('week').value).toBe(3 / (7 * 24));
    expect(fromDuration.toUnit('month').value).toBe(3 / (7 * 24 * 30.5));
  });

  it('Should convert duration units', () => {
    const fromDuration = new Duration(3, 'hour');
    expect(fromDuration.toUnit('second').unit).toBe('second');
    expect(fromDuration.toUnit('minute').unit).toBe('minute');
    expect(fromDuration.toUnit('hour').unit).toBe('hour');
    expect(fromDuration.toUnit('day').unit).toBe('day');
    expect(fromDuration.toUnit('week').unit).toBe('week');
    expect(fromDuration.toUnit('month').unit).toBe('month');
  });
});
