import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBusinessListComponent } from './my-business-list.component';

describe('MyBusinessListComponent', () => {
  let component: MyBusinessListComponent;
  let fixture: ComponentFixture<MyBusinessListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyBusinessListComponent]
    });
    fixture = TestBed.createComponent(MyBusinessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
