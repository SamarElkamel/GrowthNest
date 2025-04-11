import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListResponsComponent } from './list-respons.component';

describe('ListResponsComponent', () => {
  let component: ListResponsComponent;
  let fixture: ComponentFixture<ListResponsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListResponsComponent]
    });
    fixture = TestBed.createComponent(ListResponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
