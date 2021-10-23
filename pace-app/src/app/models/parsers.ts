import {parseDistance} from "./distance";
import {parseDuration} from "./duration";
import {InvalidMetric, Metric} from "./metric";

// TODO: Reconsider this interface. Doesn't work for minutes vs meters as mm
export function parseMetric(metric: string): Metric|InvalidMetric {
  const cleanedMetric = clean(metric);

  const maybeDistance = parseDistance(cleanedMetric);
  if (maybeDistance.isValid()) return maybeDistance;

  const maybeDuration = parseDuration(cleanedMetric);
  if (maybeDuration.isValid()) return maybeDuration;

  return maybeDuration;
}

function clean(metric: string): string {
  return removeWhitespace(metric);
}

function removeWhitespace(metric: string): string {
  return metric.trim().replace(/\s?\/\s?/g, '/'); // Remove spaces around '/' for ratios.
}
