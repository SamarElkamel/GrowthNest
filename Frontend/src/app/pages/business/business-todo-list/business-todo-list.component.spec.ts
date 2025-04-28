import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTodoListComponent } from './business-todo-list.component';

describe('BusinessTodoListComponent', () => {
  let component: BusinessTodoListComponent;
  let fixture: ComponentFixture<BusinessTodoListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessTodoListComponent]
    });
    fixture = TestBed.createComponent(BusinessTodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
