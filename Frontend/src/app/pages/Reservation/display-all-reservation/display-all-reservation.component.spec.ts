import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationListComponent } from './display-all-reservation.component';

describe('DisplayAllReservationComponent', () => {
  let component: RegistrationListComponent;
  let fixture: ComponentFixture<RegistrationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationListComponent]
    });
    fixture = TestBed.createComponent(RegistrationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
