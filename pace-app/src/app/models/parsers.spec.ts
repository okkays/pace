import {addMetricMatchers} from './matchers';
import {Metric} from './metric';
import {parseMetrics} from './parsers';

describe('parseMetrics', () => {
  beforeEach(addMetricMatchers);

  it('parses durations', () => {
    const metrics = parseMetrics('5 hours') as Metric[];

    expect(metrics.length).toBe(1);
    (expect(metrics[0]) as any).toBeMetric(5, 'hour');
  });

  it('parses distances', () => {
    const metrics = parseMetrics('5 km') as Metric[];

    expect(metrics.length).toBe(1);
    (expect(metrics[0]) as any).toBeMetric(5, 'kilometer');
  });

  it('parses paces', () => {
    const metrics = parseMetrics('5 minute/mile') as Metric[];

    expect(metrics.length).toBe(1);
    (expect(metrics[0]) as any).toBeMetric(5, 'minute/mile');
  });

  it('parses minute paces', () => {
    const metrics = parseMetrics('12:00 minutes/kilometer') as Metric[];

    expect(metrics.length).toBe(1);
    (expect(metrics[0]) as any).toBeMetric(12, 'minute/kilometer');
  });

  it('lets invalid metrics fall through', () => {
    (expect(parseMetrics('5 foo')) as any).toBeInvalidMetric(5, null);
  });
});
