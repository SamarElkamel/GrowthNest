import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayByIdDeliveryAgencyComponent } from './display-by-id-delivery-agency.component';

describe('DisplayByIdDeliveryAgencyComponent', () => {
  let component: DisplayByIdDeliveryAgencyComponent;
  let fixture: ComponentFixture<DisplayByIdDeliveryAgencyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayByIdDeliveryAgencyComponent]
    });
    fixture = TestBed.createComponent(DisplayByIdDeliveryAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
