import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessDetailBComponent } from './business-detail-b.component';

describe('BusinessDetailBComponent', () => {
  let component: BusinessDetailBComponent;
  let fixture: ComponentFixture<BusinessDetailBComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessDetailBComponent]
    });
    fixture = TestBed.createComponent(BusinessDetailBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
