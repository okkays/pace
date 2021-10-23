export function parseValue(metric: string): number|null {
  const digitsOnly = metric.replace(/[^\d\.]+/g, '');
  if (!digitsOnly) return null;
  const parsed = Number(digitsOnly);
  if (isNaN(parsed)) return null;
  return parsed;
}
