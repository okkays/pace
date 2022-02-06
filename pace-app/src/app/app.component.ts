import {Component} from '@angular/core';
import {merge, Observable, scan, Subject} from 'rxjs';
import {map, mergeWith, startWith, tap} from 'rxjs/operators';

import {Metric} from './models/metric';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  conversionsSubject = new Subject<Metric>();
  deletedSubject = new Subject<Metric>();
  conversions$: Observable<Array<Metric|null>> =
      merge(
          this.conversionsSubject.pipe(map(added => ({added}))),
          this.deletedSubject.pipe(map(deleted => ({deleted}))),
          )
          .pipe(
              scan<{deleted?: Metric, added?: Metric|null}, Array<Metric|null>>(
                  (conversions, {added, deleted}) => {
                    if (added) return [...conversions, added.clone()];
                    if (deleted) {
                      return conversions.filter(
                          conversion => !Object.is(deleted, conversion));
                    }
                    return conversions;
                  },
                  [null]),
              startWith([null]),
          );
}
