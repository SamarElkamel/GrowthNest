import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOffresComponent } from './manage-offres.component';

describe('ManageOffresComponent', () => {
  let component: ManageOffresComponent;
  let fixture: ComponentFixture<ManageOffresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageOffresComponent]
    });
    fixture = TestBed.createComponent(ManageOffresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
