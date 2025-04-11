import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatePostComponent } from './validate-post.component';

describe('ValidatePostComponent', () => {
  let component: ValidatePostComponent;
  let fixture: ComponentFixture<ValidatePostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValidatePostComponent]
    });
    fixture = TestBed.createComponent(ValidatePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
