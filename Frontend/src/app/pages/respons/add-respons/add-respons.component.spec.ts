import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddResponsComponent } from './add-respons.component';

describe('AddResponsComponent', () => {
  let component: AddResponsComponent;
  let fixture: ComponentFixture<AddResponsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddResponsComponent]
    });
    fixture = TestBed.createComponent(AddResponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
