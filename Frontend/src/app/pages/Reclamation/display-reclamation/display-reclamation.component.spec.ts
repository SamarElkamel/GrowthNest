import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayReclamationComponent } from './display-reclamation.component';

describe('DisplayReclamationComponent', () => {
  let component: DisplayReclamationComponent;
  let fixture: ComponentFixture<DisplayReclamationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayReclamationComponent]
    });
    fixture = TestBed.createComponent(DisplayReclamationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
