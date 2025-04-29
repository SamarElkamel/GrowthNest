import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessNotificationItemComponent } from './business-notification-item.component';

describe('BusinessNotificationItemComponent', () => {
  let component: BusinessNotificationItemComponent;
  let fixture: ComponentFixture<BusinessNotificationItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessNotificationItemComponent]
    });
    fixture = TestBed.createComponent(BusinessNotificationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
