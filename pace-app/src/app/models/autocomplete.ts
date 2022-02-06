import {EventEmitter} from '@angular/core';
import {map, MonoTypeOperatorFunction, OperatorFunction, pipe, tap} from 'rxjs';

import {abbreviateDistance, Distance, DISTANCES, pluralizeDistance} from './distance';
import {abbreviateDuration, Duration, DURATIONS, pluralizeDuration} from './duration';
import {InvalidMetric, Metric} from './metric';
import {Pace, PACES, pluralizePace} from './pace';

export function getMetricOptions(
    metric: Metric|InvalidMetric, matchMetrics: Metric[]): string[] {
  const options = [];
  if ((!metric.isValid() || metric instanceof Distance) &&
      (!matchMetrics.length ||
       matchMetrics.some(match => match instanceof Distance))) {
    options.push(...getDistanceOptions(metric));
  }
  if ((!metric.isValid() || metric instanceof Duration) &&
      (!matchMetrics.length ||
       matchMetrics.some(match => match instanceof Duration))) {
    options.push(...getDurationOptions(metric));
  }
  if (!matchMetrics.length ||
      matchMetrics.some(match => match instanceof Pace)) {
    options.push(...getPaceOptions(metric));
  }

  return options;
}

function getDistanceOptions(metric: Distance|InvalidMetric): string[] {
  const distances = DISTANCES.map(abbreviateDistance).flat();

  if (metric.isPlural()) {
    return distances.map(distance => pluralizeDistance(distance));
  }
  return [...distances];
}

function getDurationOptions(metric: Duration|InvalidMetric): string[] {
  const durations = DURATIONS.map(abbreviateDuration).flat();

  if (metric.isPlural()) {
    return durations.map(duration => pluralizeDuration(duration));
  }
  return [...durations];
}

function getPaceOptions(metric: Pace|InvalidMetric): string[] {
  if (metric.isPlural()) {
    const pluralPaces: string[] = [];
    for (const pace of PACES) {
      const pluralPace = pluralizePace(pace)
      if (pluralPace === null) continue;
      pluralPaces.push(pluralPace);
    }
    return pluralPaces;
  }

  return [...PACES];
}

export interface SearchArgs<T = string> {
  prefix?: string;
  term: string;
  options: string[];
  selectedItem?: T;
  selectedItemAsString?: string;
}

export interface SearchResult<T = string> {
  results: string[];
  selectedItem?: T;
  selectedItemAsString?: string;
}

function lowerIncludes(options: string[], term: string): boolean {
  return options.some(option => option.toLowerCase() == term.toLowerCase());
}

export function searchOptions<T = undefined>():
    OperatorFunction<SearchArgs<T>, SearchResult<T>> {
  return pipe(
      map(({prefix, term, options, selectedItem, selectedItemAsString}) => {
        const lowerTerm = term.toLowerCase();
        const filteredOptions =
            options.filter(option => option.toLowerCase().includes(lowerTerm));
        return {
          options: filteredOptions,
          prefix,
          selectedItem,
          selectedItemAsString,
        };
      }),
      map(({prefix, options, selectedItem, selectedItemAsString}) => {
        const prefixedOptions = prefix ? options.map(o => prefix + o) : options;
        return {
          results: prefixedOptions,
          selectedItem,
          selectedItemAsString,
        };
      }),
  );
}

/** Builds a SearchArgs objects based on a string search. */
export function buildSearchArgs<T extends string>(options: readonly T[]):
    OperatorFunction<string, SearchArgs<T>> {
  function isOption(maybeOption: string): maybeOption is T {
    return lowerIncludes([...options], maybeOption);
  }

  return pipe(
      map(term => {
        return {
          term,
          selectedItem: isOption(term) ? term : undefined,
          selectedItemAsString: term,
          options: [...options],
        };
      }),
  );
}

/** Emits the piped result if it is in the option list. */
export function selectResult<T>(output: EventEmitter<T>):
    MonoTypeOperatorFunction<SearchResult<T>> {
  return pipe(tap(({selectedItem, selectedItemAsString, results}) => {
    if (!selectedItemAsString || !selectedItem) return;
    if (!lowerIncludes(results, selectedItemAsString)) return;
    console.log('Selecting:', selectedItem);
    output.next(selectedItem);
  }));
}