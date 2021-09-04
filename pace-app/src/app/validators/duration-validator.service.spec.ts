import { TestBed } from '@angular/core/testing';

import { DurationValidatorService } from './duration-validator.service';

describe('DurationValidatorService', () => {
  let service: DurationValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DurationValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
