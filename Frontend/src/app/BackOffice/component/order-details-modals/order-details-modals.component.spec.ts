import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsModalsComponent } from './order-details-modals.component';

describe('OrderDetailsModalsComponent', () => {
  let component: OrderDetailsModalsComponent;
  let fixture: ComponentFixture<OrderDetailsModalsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderDetailsModalsComponent]
    });
    fixture = TestBed.createComponent(OrderDetailsModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
