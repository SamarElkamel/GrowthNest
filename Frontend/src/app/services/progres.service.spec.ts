import { TestBed } from '@angular/core/testing';

import { ProgresService } from './progres.service';

describe('ProgresService', () => {
  let service: ProgresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
