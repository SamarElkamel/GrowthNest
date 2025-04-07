import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayEventByIdComponent } from './display-event-by-id.component';

describe('DisplayEventByIdComponent', () => {
  let component: DisplayEventByIdComponent;
  let fixture: ComponentFixture<DisplayEventByIdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayEventByIdComponent]
    });
    fixture = TestBed.createComponent(DisplayEventByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
