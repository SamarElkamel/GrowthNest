import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessListFrontComponent } from './business-list-front.component';

describe('BusinessListFrontComponent', () => {
  let component: BusinessListFrontComponent;
  let fixture: ComponentFixture<BusinessListFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessListFrontComponent]
    });
    fixture = TestBed.createComponent(BusinessListFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
