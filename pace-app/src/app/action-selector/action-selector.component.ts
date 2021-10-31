import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {Action, ACTIONS, isAction} from '../models/action';
import {buildSearchArgs, searchOptions, SearchResult, selectResult} from '../models/autocomplete';


function isActionResult(result: SearchResult<string>):
    result is SearchResult<Action> {
  if (!result.selectedItem) return false;
  return isAction(result.selectedItem);
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
        buildSearchArgs(ACTIONS),
        searchOptions(),
        selectResult(this.actionSelected),
        map(({results}) => results),
    );
  }
}
