import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {map, Observable} from 'rxjs';

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
export class PaceEntryComponent implements OnInit {
  @Input() label: string = 'Pace';
  @Input() placeholder: string = '5 kph';
  @Output() metricsSelected = new EventEmitter<Metric[]>();
  actionControl = new FormControl();

  filteredOptions!: Observable<string[]>;
  enteredMetrics$!: Observable<RawMetrics>;

  constructor() {}

  ngOnInit(): void {
    this.enteredMetrics$ = this.actionControl.valueChanges.pipe(
        map(text => {
          return {
            text,
            metrics: parseMetrics(text),
          };
        }),
    );

    this.filteredOptions = this.enteredMetrics$.pipe(
        map(({text, metrics}) => {
          const unitText = text.replace(/^[^A-Za-z]*/, '');
          const prefix = text.substr(0, text.length - unitText.length);
          const options = (metrics instanceof InvalidMetric) ?
              getMetricOptions(metrics) :
              metrics.map(getMetricOptions).flat();

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
}
