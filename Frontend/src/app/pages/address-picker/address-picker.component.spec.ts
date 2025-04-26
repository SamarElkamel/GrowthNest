import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressPickerComponent } from './address-picker.component';

describe('AddressPickerComponent', () => {
  let component: AddressPickerComponent;
  let fixture: ComponentFixture<AddressPickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddressPickerComponent]
    });
    fixture = TestBed.createComponent(AddressPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
