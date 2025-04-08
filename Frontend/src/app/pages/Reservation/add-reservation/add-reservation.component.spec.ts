import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRegistrationComponent } from './add-reservation.component';

describe('AddReservationComponent', () => {
  let component: AddRegistrationComponent;
  let fixture: ComponentFixture<AddRegistrationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddRegistrationComponent]
    });
    fixture = TestBed.createComponent(AddRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
