import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayAllEventComponent } from './display-all-event.component';

describe('DisplayAllEventComponent', () => {
  let component: DisplayAllEventComponent;
  let fixture: ComponentFixture<DisplayAllEventComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayAllEventComponent]
    });
    fixture = TestBed.createComponent(DisplayAllEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
