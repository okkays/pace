import { TestBed } from '@angular/core/testing';

import { DistanceConverterService } from './distance-converter.service';

describe('DistanceConverterService', () => {
  let service: DistanceConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistanceConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
