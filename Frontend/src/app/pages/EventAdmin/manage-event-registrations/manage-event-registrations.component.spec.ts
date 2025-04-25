import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEventRegistrationsComponent } from './manage-event-registrations.component';

describe('ManageEventRegistrationsComponent', () => {
  let component: ManageEventRegistrationsComponent;
  let fixture: ComponentFixture<ManageEventRegistrationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageEventRegistrationsComponent]
    });
    fixture = TestBed.createComponent(ManageEventRegistrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
