import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {combineLatest, map, Observable, of} from 'rxjs';
import {filter, startWith, tap} from 'rxjs/operators';

import {getMetricOptions, searchOptions, selectResult} from '../models/autocomplete';
import {InvalidMetric, Metric} from '../models/metric';
import {parseMetrics} from '../models/parsers';

interface RawMetrics {
  text: string;
  metrics: Metric[]|InvalidMetric;
}

@Component({
  selector: 'app-pace-entry',
  templateUrl: './pace-entry.component.html',
  styleUrls: ['./pace-entry.component.css']
})
export class PaceEntryComponent implements OnInit, AfterViewInit {
  @Input() label: string = 'Pace';
  @Input() placeholder: string = '5 kph';
  @Input() matchUnitOf$!: Observable<Metric[]>;
  @Input() allowValues: boolean = true;
  @Input() requireValues: boolean = false;
  @Input() initial?: Metric;
  @Output() metricsSelected = new EventEmitter<Metric[]>();
  actionControl = new FormControl();

  filteredOptions$!: Observable<string[]>;
  enteredMetrics$!: Observable<RawMetrics>;

  ngOnInit(): void {
    if (!this.allowValues && this.requireValues) {
      throw new Error(
          'allowValues cannot be false while requireValues is true');
    }
    if (!this.matchUnitOf$) {
      this.matchUnitOf$ = of([]);
    }
    this.enteredMetrics$ = this.actionControl.valueChanges.pipe(
        tap(() => this.metricsSelected.next([])),
        filter(text => {
          if (typeof text !== 'string') {
            return false;
          }
          if (text.match(/\d+/)) {
            if (!this.allowValues) {
              this.actionControl.setValue(text.replace(/\d+/g, ''));
              return false;
            }
          } else {
            if (this.requireValues) {
              return false;
            }
          }
          return true;
        }),
        map(text => {
          return {
            text,
            metrics: parseMetrics(text),
          };
        }),
    );

    this.filteredOptions$ =
        combineLatest([
          this.enteredMetrics$.pipe(startWith({text: '', metrics: []})),
          this.matchUnitOf$.pipe(startWith([]))
        ])
            .pipe(
                map(([{text, metrics}, matchMetrics]) => {
                  const unitText = text.replace(/^[^A-Za-z]*/, '');
                  const prefix = text.substr(0, text.length - unitText.length);
                  const options = (metrics instanceof InvalidMetric) ?
                      getMetricOptions(metrics, matchMetrics) :
                      metrics.flatMap(
                          metric => getMetricOptions(metric, matchMetrics));

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
