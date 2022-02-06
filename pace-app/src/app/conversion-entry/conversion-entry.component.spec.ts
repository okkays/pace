import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import {ConversionEntryComponent} from './conversion-entry.component';

describe('ConversionEntryComponent', () => {
  let component: ConversionEntryComponent;
  let fixture: ComponentFixture<ConversionEntryComponent>;

  beforeEach(async () => {
    await TestBed
        .configureTestingModule({
          declarations: [ConversionEntryComponent],
          imports: [MatSnackBarModule],
        })
        .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversionEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
