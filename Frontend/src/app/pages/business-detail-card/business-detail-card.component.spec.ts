import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessDetailCardComponent } from './business-detail-card.component';

describe('BusinessDetailCardComponent', () => {
  let component: BusinessDetailCardComponent;
  let fixture: ComponentFixture<BusinessDetailCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessDetailCardComponent]
    });
    fixture = TestBed.createComponent(BusinessDetailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
