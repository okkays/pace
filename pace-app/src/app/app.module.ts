import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {ActionSelectorComponent} from './action-selector/action-selector.component';
import {AppComponent} from './app.component';
import {MaterialModule} from './material/material.module';
import { PaceEntryComponent } from './pace-entry/pace-entry.component';

@NgModule({
  declarations: [AppComponent, ActionSelectorComponent, PaceEntryComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
