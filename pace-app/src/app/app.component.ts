import {Component} from '@angular/core';
import {combineLatest, Observable, ReplaySubject, Subject} from 'rxjs';
import {filter, map, mapTo, merge, mergeWith, shareReplay, startWith, tap} from 'rxjs/operators';

import {Action} from './models/action';
import {forOrAt} from './models/effort';
import {MaybeMetric, Metric} from './models/metric';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  actionSelected$ = new ReplaySubject<Action>(1);
  fromSubject$ = new ReplaySubject<Metric[]>(1);
  toSubject$ = new ReplaySubject<Metric[]>(1);
  forOrAtSubject$ = new ReplaySubject<Metric[]>(1);

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
}
