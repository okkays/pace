import { TestBed } from '@angular/core/testing';

import { DurationParserService } from './duration-parser.service';

describe('DurationParserService', () => {
  let service: DurationParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DurationParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
