import { TestBed } from '@angular/core/testing';

import { PaceValidatorService } from './pace-validator.service';

describe('PaceValidatorService', () => {
  let service: PaceValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaceValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
