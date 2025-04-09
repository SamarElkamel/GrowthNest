import { TestBed } from '@angular/core/testing';

import { DeliveryAgencyService } from './delivery-agency.service';

describe('DeliveryAgencyService', () => {
  let service: DeliveryAgencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveryAgencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
