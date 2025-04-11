import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateResponsComponent } from './update-respons.component';

describe('UpdateResponsComponent', () => {
  let component: UpdateResponsComponent;
  let fixture: ComponentFixture<UpdateResponsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateResponsComponent]
    });
    fixture = TestBed.createComponent(UpdateResponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
