import { TestBed } from '@angular/core/testing';

import { EffortParserService } from './effort-parser.service';

describe('EffortParserService', () => {
  let service: EffortParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EffortParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
