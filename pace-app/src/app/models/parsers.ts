import {Distance, parseDistance} from "./distance";
import {Metric} from "./metric";

export class Parsers {
}

export function parseMetric(metric: string): Metric|null {
  const cleanedMetric = clean(metric);

  const maybeDistance = parseDistance(cleanedMetric);
  if (maybeDistance) return maybeDistance;

  return null;
}

function clean(metric: string): string {
  return removeWhitespace(metric);
}

function removeWhitespace(metric: string): string {
  return metric.trim().replace(/\s?\/\s?/g, '/'); // Remove spaces around '/' for ratios.
}
