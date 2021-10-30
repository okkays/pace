import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MonoTypeOperatorFunction, Observable, OperatorFunction, pipe} from 'rxjs';
import {map, startWith, tap} from 'rxjs/operators';

import {Action, ACTIONS, isAction} from '../models/action';


function search(options: readonly string[]):
    OperatorFunction<string, string[]> {
  return pipe(map(term => {
    const lowerTerm = term.toLowerCase();
    return options.filter(option => option.toLowerCase().includes(lowerTerm));
  }));
}

@Component({
  selector: 'app-action-selector',
  templateUrl: './action-selector.component.html',
  styleUrls: ['./action-selector.component.css']
})
export class ActionSelectorComponent implements OnInit {
  actionControl = new FormControl();
  filteredOptions!: Observable<string[]>;

  @Output() actionSelected = new EventEmitter<Action>();

  ngOnInit() {
    this.filteredOptions = this.actionControl.valueChanges.pipe(
        startWith(''),
        this.select,
        search(ACTIONS),
    );
  }

  private readonly select: MonoTypeOperatorFunction<string> = pipe(tap(term => {
    if (!isAction(term)) return;
    this.actionSelected.next(term);
  }));
}
