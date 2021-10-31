import {Component} from '@angular/core';
import {combineLatest, Observable, ReplaySubject} from 'rxjs';
import {filter, map, tap} from 'rxjs/operators';

import {Action} from './models/action';
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

  convertedMetric$: Observable<Metric> =
      combineLatest([this.fromSubject$, this.toSubject$])
          .pipe(
              filter(([from, to]) => {
                if (from.length !== 1 || to.length !== 1) return false;
                if (to[0].unit === null) return false;
                return true;
              }),
              map(([from, to]) => {
                // Cast checked in filter above.
                return from[0].toUnit(to[0].unit as string);
              }),
              tap(result => {
                console.log('Result:', result);
              }),
              filter<MaybeMetric, Metric>(isMetricForFilter),
          );
}

function isMetricForFilter(metric: MaybeMetric): metric is Metric {
  return metric.isValid();
}
