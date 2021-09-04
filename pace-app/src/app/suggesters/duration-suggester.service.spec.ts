import { TestBed } from '@angular/core/testing';

import { DurationSuggesterService } from './duration-suggester.service';

describe('DurationSuggesterService', () => {
  let service: DurationSuggesterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DurationSuggesterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
