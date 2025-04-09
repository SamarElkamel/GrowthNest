import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayAllDeliveryAgencyComponent } from './display-all-delivery-agency.component';

describe('DisplayAllDeliveryAgencyComponent', () => {
  let component: DisplayAllDeliveryAgencyComponent;
  let fixture: ComponentFixture<DisplayAllDeliveryAgencyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayAllDeliveryAgencyComponent]
    });
    fixture = TestBed.createComponent(DisplayAllDeliveryAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
