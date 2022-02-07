function getSpecifier(metric: string): number|null {
  if (metric.search(/^[\s\d]*full/) !== -1) return 1;
  if (metric.search(/^[\s\d]*half/) !== -1) return 0.5;
  if (metric.search(/^[\s\d]*quarter/) !== -1) return 0.25;
  return null;
}

export function parseValue(metric: string): number|null {
  const digitsOnly = metric.replace(/[^\d\.]+/g, '');
  const specifier = getSpecifier(metric);

  if (!digitsOnly) {
    if (specifier !== null) return specifier;
    return null;
  }
  const parsed = Number(digitsOnly);
  if (isNaN(parsed)) {
    return null;
  }
  return parsed * (specifier || 1);
}

export function getHms(minutes: number): string {
  const hourPortion = Math.floor(minutes / 60);
  const minutePortion = Math.floor(minutes % 60);
  const secondPortion = Math.round((minutes % 1) * 60);

  const paddedHours = String(hourPortion).padStart(2, '0');
  const paddedMinute = String(minutePortion).padStart(2, '0');
  const paddedSecond = String(secondPortion).padStart(2, '0');

  if (secondPortion === 0 && minutePortion === 0) return String(hourPortion);

  return `${paddedHours}:${paddedMinute}:${paddedSecond}`;
}

export function getMs(minutes: number): string {
  const minutePortion = Math.floor(minutes);
  const secondPortion = Math.round((minutes % 1) * 60);

  const paddedMinute = minutePortion;
  const paddedSecond = String(secondPortion).padStart(2, '0');

  if (secondPortion === 0) return String(minutePortion);

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
