import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventUserDetailsComponent } from './event-user-details.component';

describe('EventUserDetailsComponent', () => {
  let component: EventUserDetailsComponent;
  let fixture: ComponentFixture<EventUserDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventUserDetailsComponent]
    });
    fixture = TestBed.createComponent(EventUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
