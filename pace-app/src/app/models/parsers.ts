import {parseDistance} from './distance';
import {parseDuration} from './duration';
import {InvalidMetric, Metric} from './metric';
import {parsePace} from './pace';

export function parseMetrics(metric: string): Metric[]|InvalidMetric {
  const cleanedMetric = clean(metric);

  const maybePace = parsePace(cleanedMetric);
  const maybeDistance = parseDistance(cleanedMetric);
  const maybeDuration = parseDuration(cleanedMetric);

  if (maybePace.isValid()) return [maybePace];

  const validMetrics = [];
  if (maybeDistance.isValid()) validMetrics.push(maybeDistance);
  if (maybeDuration.isValid()) validMetrics.push(maybeDuration);
  if (validMetrics.length) return validMetrics;

  return maybeDuration;
}

function clean(metric: string): string {
  return removeWhitespace(metric);
}

function removeWhitespace(metric: string): string {
  return metric.trim().replace(
      /\s?\/\s?/g, '/');  // Remove spaces around '/' for ratios.
}
