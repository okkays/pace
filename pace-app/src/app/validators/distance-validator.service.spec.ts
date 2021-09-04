import { TestBed } from '@angular/core/testing';

import { DistanceValidatorService } from './distance-validator.service';

describe('DistanceValidatorService', () => {
  let service: DistanceValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistanceValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
