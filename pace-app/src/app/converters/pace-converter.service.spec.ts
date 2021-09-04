import { TestBed } from '@angular/core/testing';

import { PaceConverterService } from './pace-converter.service';

describe('PaceConverterService', () => {
  let service: PaceConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaceConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
