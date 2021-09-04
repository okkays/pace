import { TestBed } from '@angular/core/testing';

import { PaceSuggesterService } from './pace-suggester.service';

describe('PaceSuggesterService', () => {
  let service: PaceSuggesterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaceSuggesterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
