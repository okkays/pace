import {Component} from '@angular/core';
import {ReplaySubject} from 'rxjs';

import {Action} from './models/action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  actionSelected$ = new ReplaySubject<Action>(1);
  title = 'pace-app';

  constructor() {
    this.actionSelected$.subscribe(action => {
      console.log(action);
    });
  }
}
