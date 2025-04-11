import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteResponsComponent } from './delete-respons.component';

describe('DeleteResponsComponent', () => {
  let component: DeleteResponsComponent;
  let fixture: ComponentFixture<DeleteResponsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteResponsComponent]
    });
    fixture = TestBed.createComponent(DeleteResponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
