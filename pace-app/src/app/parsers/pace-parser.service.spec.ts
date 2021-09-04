import { TestBed } from '@angular/core/testing';

import { PaceParserService } from './pace-parser.service';

describe('PaceParserService', () => {
  let service: PaceParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaceParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
