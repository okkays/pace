import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {combineLatest, map, Observable, of, OperatorFunction, pipe, Subject} from 'rxjs';
import {concatMap, concatWith, filter, mapTo, mergeWith, startWith, takeUntil, tap} from 'rxjs/operators';

import {getMetricOptions, searchOptions, selectResult} from '../models/autocomplete';
import {InvalidMetric, Metric} from '../models/metric';
import {parseMetrics} from '../models/parsers';
import {getUnitText} from '../models/util';

interface RawMetrics {
  text: string;
  metrics: Metric[]|InvalidMetric;
}

@Component({
  selector: 'app-pace-entry',
  templateUrl: './pace-entry.component.html',
  styleUrls: ['./pace-entry.component.css']
})
export class PaceEntryComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() label: string = 'Pace';
  @Input() placeholder: string = '5 kph';
  @Input() matchUnitOf$!: Observable<Metric[]>;
  @Input() allowValues: boolean = true;
  @Input() requireValues: boolean = false;
  @Input() initial?: Metric;
  @Input() reset$!: Observable<void>;
  @Output() metricsSelected = new EventEmitter<Metric[]>();
  actionControl = new FormControl();

  filteredOptions$!: Observable<string[]>;
  enteredMetrics$!: Observable<RawMetrics>;

  destroySubject$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroySubject$.next();
  }

  private sanitizeMetricText: OperatorFunction<string, string> = pipe(
      map(value => value.trim()),
      map(text => {
        if (text.match(/^[^A-Za-z0-9]+/)) {
          const textWithoutGarbage = text.replace(/^[^A-Za-z0-9]+/g, '');
          this.actionControl.setValue(textWithoutGarbage);
          return textWithoutGarbage;
        }
        if (text.match(/\d+/)) {
          if (!this.allowValues) {
            const valueless = text.replace(/\d+/g, '');
            this.actionControl.setValue(valueless);
            return valueless;
          }
        } else if (this.requireValues && text.search(/[a-zA-Z]+/) !== -1) {
          const oneValue = `1 ${text}`;
          this.actionControl.setValue(oneValue);
          return oneValue;
        }
        return text;
      }),
  );

  private parseMetricsFromText: OperatorFunction<string, RawMetrics> = pipe(
      map(text => {
        return {
          text,
          metrics: parseMetrics(text),
        };
      }),
  )

  ngOnInit(): void {
    if (!this.reset$) this.reset$ = of();
    this.reset$
        .pipe(
            takeUntil(this.destroySubject$),
            tap(() => this.actionControl.setValue('')))
        .subscribe();  // Direct call to subscribe to interact with formControl
    if (!this.allowValues && this.requireValues) {
      throw new Error(
          'allowValues cannot be false while requireValues is true');
    }
    if (!this.matchUnitOf$) {
      this.matchUnitOf$ = of([]);
    }
    this.enteredMetrics$ = this.actionControl.valueChanges.pipe(
        this.sanitizeMetricText,
        this.parseMetricsFromText,
    );

    this.filteredOptions$ =
        combineLatest([
          this.enteredMetrics$.pipe(startWith({text: '', metrics: []})),
          this.matchUnitOf$.pipe(startWith([]))
        ])
            .pipe(
                map(([{text, metrics}, matchMetrics]) => {
                  const unitText = getUnitText(text);
                  const prefix = text.substr(0, text.length - unitText.length);
                  const options = getMetricOptions(matchMetrics);

                  return {
                    prefix,
                    term: unitText,
                    options,
                    selectedItem: metrics instanceof InvalidMetric ? undefined :
                                                                     metrics,
                    selectedItemAsString: text,
                  };
                }),
                searchOptions(),
                tap(searched => {
                  if (!searched.selectedItemAsString) {
                    this.metricsSelected.next([]);
                  }
                }),
                map(searched => {
                  return {...searched, results: searched.results.slice(0, 50)};
                }),
                selectResult(this.metricsSelected),
                map(result => result.results),
            );
  }

  ngAfterViewInit() {
    setTimeout(() => {  // setTimeout to avoid ChangedAfterItHasBeenChecked.
      if (this.initial) {
        this.actionControl.setValue(this.initial.toString());
      }
    }, 0);
  }
}
