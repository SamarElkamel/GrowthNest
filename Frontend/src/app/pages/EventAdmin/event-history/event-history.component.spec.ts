import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventHistoryComponent } from './event-history.component';

describe('EventHistoryComponent', () => {
  let component: EventHistoryComponent;
  let fixture: ComponentFixture<EventHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventHistoryComponent]
    });
    fixture = TestBed.createComponent(EventHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
