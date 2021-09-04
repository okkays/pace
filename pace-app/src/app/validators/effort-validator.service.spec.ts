import { TestBed } from '@angular/core/testing';

import { EffortValidatorService } from './effort-validator.service';

describe('EffortValidatorService', () => {
  let service: EffortValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EffortValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
