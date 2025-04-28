import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryAgencyDashboardComponent } from './delivery-agency-dashboard.component';

describe('DeliveryAgencyDashboardComponent', () => {
  let component: DeliveryAgencyDashboardComponent;
  let fixture: ComponentFixture<DeliveryAgencyDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveryAgencyDashboardComponent]
    });
    fixture = TestBed.createComponent(DeliveryAgencyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
