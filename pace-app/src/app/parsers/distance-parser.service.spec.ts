import { TestBed } from '@angular/core/testing';

import { DistanceParserService } from './distance-parser.service';

describe('DistanceParserService', () => {
  let service: DistanceParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistanceParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
