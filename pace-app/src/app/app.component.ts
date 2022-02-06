import {Component} from '@angular/core';
import {Observable, scan, Subject} from 'rxjs';
import {startWith, tap} from 'rxjs/operators';

import {Metric} from './models/metric';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  conversionsSubject = new Subject<Metric>();
  conversions$: Observable<Array<Metric|null>> = this.conversionsSubject.pipe(
      scan<Metric|null, Array<Metric|null>>(
          (conversions, newConversion) => {
            return [...conversions, newConversion];
          },
          [null]),
      startWith([null]),
      tap(conversion => console.log(conversion)),
  );
}
