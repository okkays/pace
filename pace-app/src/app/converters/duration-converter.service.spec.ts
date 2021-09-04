import { TestBed } from '@angular/core/testing';

import { DurationConverterService } from './duration-converter.service';

describe('DurationConverterService', () => {
  let service: DurationConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DurationConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
