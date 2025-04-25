import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessproductsComponent } from './businessproducts.component';

describe('BusinessproductsComponent', () => {
  let component: BusinessproductsComponent;
  let fixture: ComponentFixture<BusinessproductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessproductsComponent]
    });
    fixture = TestBed.createComponent(BusinessproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
