import {ClipboardModule} from '@angular/cdk/clipboard';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {ActionSelectorComponent} from './action-selector/action-selector.component';
import {AppComponent} from './app.component';
import {ConversionEntryComponent} from './conversion-entry/conversion-entry.component';
import {MaterialModule} from './material/material.module';
import {PaceEntryComponent} from './pace-entry/pace-entry.component';

@NgModule({
  declarations: [
    ActionSelectorComponent,
    AppComponent,
    ConversionEntryComponent,
    PaceEntryComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    ClipboardModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
