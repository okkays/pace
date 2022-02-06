import {Clipboard} from '@angular/cdk/clipboard';
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {combineLatest, Observable, ReplaySubject} from 'rxjs';
import {map, shareReplay, startWith, tap} from 'rxjs/operators';

import {Action} from '../models/action';
import {compliment, forOrAt, suggest} from '../models/effort';
import {Metric} from '../models/metric';

@Component({
  selector: 'app-conversion-entry',
  templateUrl: './conversion-entry.component.html',
  styleUrls: ['./conversion-entry.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversionEntryComponent {
  @Output() conversionSelected = new EventEmitter<Metric>();
  @Output() cancelClicked = new EventEmitter<void>();
  @Input() initialFrom?: Metric;
  actionSelected$ = new ReplaySubject<Action>(1);
  fromSubject$ = new ReplaySubject<Metric[]>(1);
  toSubject$ = new ReplaySubject<Metric[]>(1);
  forOrAtSubject$ = new ReplaySubject<Metric[]>(1);

  suggest(metric: Metric): Array<{metric: Metric, index: number}> {
    return suggest(metric).map((metric, index) => ({metric, index}));
  }

  /** For use with trackBy. */
  getIndex(index: number, item: {index: number}): number {
    return item.index;
  }

  forOrAtCompliment$: Observable<Metric[]> = this.fromSubject$.pipe(
      map(fromMetrics => fromMetrics.map(compliment).flat()));

  convertedMetric$: Observable<Metric|null> =
      combineLatest([this.fromSubject$, this.toSubject$])
          .pipe(
              map(([from, to]) => {
                if (from.length !== 1 || to.length !== 1) return [null, null];
                if (to[0].unit === null) return [null, null];
                return [from, to];
              }),
              map(([from, to]) => {
                // Cast checked in filter above.
                if (!from || !to) return null;
                return from[0].toUnit(to[0].unit as string);
              }),
              tap(result => {
                console.log('Result:', result);
              }),
              map(metric => metric?.isValid() ? metric : null),
              shareReplay(1),
          );

  convertedEffort$: Observable<Metric|null> =
      combineLatest([
        this.fromSubject$,
        this.convertedMetric$.pipe(startWith(null)),
        this.forOrAtSubject$,
      ])
          .pipe(
              map(([from, converted, forOrAts]) => {
                const fromMetrics = [converted || from].flat();
                if (!fromMetrics.length) {
                  return null;
                }
                const potentialMetrics =
                    fromMetrics
                        .map(fromMetric => {
                          return forOrAts.map(forOrAtMetric => {
                            return forOrAt(fromMetric, forOrAtMetric);
                          });
                        })
                        .flat();
                for (const metric of potentialMetrics) {
                  if (metric.isValid()) return metric;
                }
                return null;
              }),
          );

  constructor(private snackBar: MatSnackBar, private clipboard: Clipboard) {}

  selectConversion(conversion: Metric) {
    this.conversionSelected.next(conversion);
  }

  copyToClipboard(content: string) {
    this.snackBar.open(`Copied "${content}" to the clipboard!`, undefined, {
      duration: 2000,
    });
    this.clipboard.copy(content);
  }
}
