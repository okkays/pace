import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {map, Observable} from 'rxjs';
import {filter} from 'rxjs/operators';

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
  @Input() allowValues: boolean = true;
  @Output() metricsSelected = new EventEmitter<Metric[]>();
  actionControl = new FormControl();

  filteredOptions!: Observable<string[]>;
  enteredMetrics$!: Observable<RawMetrics>;

  ngOnInit(): void {
    this.enteredMetrics$ = this.actionControl.valueChanges.pipe(
        filter(text => {
          if (this.allowValues) return true;
          if (typeof text !== 'string') return false;
          if (text.match(/\d+/)) {
            this.actionControl.setValue(text.replace(/\d+/g, ''));
            return false;
          };
          return true;
        }),
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