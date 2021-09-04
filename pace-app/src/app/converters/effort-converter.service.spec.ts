import { TestBed } from '@angular/core/testing';

import { EffortConverterService } from './effort-converter.service';

describe('EffortConverterService', () => {
  let service: EffortConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EffortConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
