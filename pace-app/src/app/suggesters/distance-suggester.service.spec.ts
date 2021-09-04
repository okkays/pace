import { TestBed } from '@angular/core/testing';

import { DistanceSuggesterService } from './distance-suggester.service';

describe('DistanceSuggesterService', () => {
  let service: DistanceSuggesterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistanceSuggesterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
