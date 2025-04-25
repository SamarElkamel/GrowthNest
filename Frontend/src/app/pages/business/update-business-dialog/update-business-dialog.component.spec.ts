import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBusinessDialogComponent } from './update-business-dialog.component';

describe('UpdateBusinessDialogComponent', () => {
  let component: UpdateBusinessDialogComponent;
  let fixture: ComponentFixture<UpdateBusinessDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateBusinessDialogComponent]
    });
    fixture = TestBed.createComponent(UpdateBusinessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
