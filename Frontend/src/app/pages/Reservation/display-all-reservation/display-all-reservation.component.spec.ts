import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayAllReservationComponent } from './display-all-reservation.component';

describe('DisplayAllReservationComponent', () => {
  let component: DisplayAllReservationComponent;
  let fixture: ComponentFixture<DisplayAllReservationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayAllReservationComponent]
    });
    fixture = TestBed.createComponent(DisplayAllReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
