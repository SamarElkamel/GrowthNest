import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayReservationByIdComponent } from './display-reservation-by-id.component';

describe('DisplayReservationByIdComponent', () => {
  let component: DisplayReservationByIdComponent;
  let fixture: ComponentFixture<DisplayReservationByIdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayReservationByIdComponent]
    });
    fixture = TestBed.createComponent(DisplayReservationByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
