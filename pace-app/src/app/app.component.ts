import {AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChildren} from '@angular/core';
import {merge, Observable, scan, Subject} from 'rxjs';
import {map, startWith, takeUntil} from 'rxjs/operators';
import {Metric} from './models/metric';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  conversionsSubject = new Subject<Metric>();
  deletedSubject = new Subject<Metric>();
  destroySubject = new Subject<void>();
  @ViewChildren('conversion', {read: ElementRef})
  conversionElements!: QueryList<ElementRef>;

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

  ngAfterViewInit() {
    this.conversionElements.changes
        .pipe(
            // Cast because angular doesn't type the changes observable.
            map(elements => elements as QueryList<ElementRef<HTMLElement>>),
            scan(
                (previousElements, currentElements) => {
                  const addedElements = currentElements.filter(
                      currentElement => !previousElements.some(
                          previousElement =>
                              currentElement === previousElement));
                  if (addedElements.length) {
                    addedElements[0].nativeElement.scrollIntoView(
                        {block: 'start', behavior: 'smooth'});
                    console.log('Element added, scrolling...');
                  }
                  return currentElements.toArray();
                },
                new Array<ElementRef<HTMLElement>>()),
            takeUntil(this.destroySubject))
        .subscribe();
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
  }
}
