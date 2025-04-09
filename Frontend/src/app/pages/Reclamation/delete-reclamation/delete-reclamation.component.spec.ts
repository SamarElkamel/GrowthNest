import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteReclamationComponent } from './delete-reclamation.component';

describe('DeleteReclamationComponent', () => {
  let component: DeleteReclamationComponent;
  let fixture: ComponentFixture<DeleteReclamationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteReclamationComponent]
    });
    fixture = TestBed.createComponent(DeleteReclamationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
