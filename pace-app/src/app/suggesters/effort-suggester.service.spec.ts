import { TestBed } from '@angular/core/testing';

import { EffortSuggesterService } from './effort-suggester.service';

describe('EffortSuggesterService', () => {
  let service: EffortSuggesterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EffortSuggesterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
