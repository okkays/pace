export function parseValue(metric: string): number|null {
  const digitsOnly = metric.replace(/[^\d\.]+/g, '');
  if (!digitsOnly) return null;
  const parsed = Number(digitsOnly);
  if (isNaN(parsed)) return null;
  return parsed;
}

export function getHms(minutes: number): string {
  const hourPortion = Math.floor(minutes / 60);
  const minutePortion = Math.floor(minutes % 60);
  const secondPortion = Math.round((minutes % 1) * 60);

  const paddedHours = String(hourPortion).padStart(2, '0');
  const paddedMinute = String(minutePortion).padStart(2, '0');
  const paddedSecond = String(secondPortion).padStart(2, '0');

  const resultingPortions = [];

  if (hourPortion !== 0) resultingPortions.push(hourPortion);
  resultingPortions.push(minutePortion);
  resultingPortions.push(secondPortion);

  return `${paddedHours}:${paddedMinute}:${paddedSecond}`;
}

export function getMs(minutes: number): string {
  const minutePortion = Math.floor(minutes);
  const secondPortion = Math.round((minutes % 1) * 60);

  const paddedMinute = minutePortion;
  const paddedSecond = String(secondPortion).padStart(2, '0');

  const resultingPortions = [];

  resultingPortions.push(minutePortion);
  resultingPortions.push(secondPortion);

  return `${paddedMinute}:${paddedSecond}`;
}

/** Parses an HH:MM:SS string, returning the number of seconds represented. */
export function parseHms(metric: string): number|null {
  const digitsOnly = metric.replace(/[^\d\.:]+/g, '');
  const portions = digitsOnly.split(':');
  if (portions.length === 2) {
    const minutes = parseFloat(portions[0]);
    const seconds = parseFloat(portions[1]);
    return (60 * minutes) + seconds;
  } else if (portions.length === 3) {
    const hours = parseFloat(portions[0]);
    const minutes = parseFloat(portions[1]);
    const seconds = parseFloat(portions[2]);
    return (60 * 60 * hours) + (60 * minutes) + seconds;
  }
  return null;
}

export function round(unrounded: number, places: number) {
  return +(
      Math.round((unrounded + 'e+' + places) as unknown as number) + 'e-' +
      places);
}
