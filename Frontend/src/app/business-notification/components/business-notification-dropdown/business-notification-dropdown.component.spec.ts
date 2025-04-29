import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessNotificationDropdownComponent } from './business-notification-dropdown.component';

describe('BusinessNotificationDropdownComponent', () => {
  let component: BusinessNotificationDropdownComponent;
  let fixture: ComponentFixture<BusinessNotificationDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessNotificationDropdownComponent]
    });
    fixture = TestBed.createComponent(BusinessNotificationDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
