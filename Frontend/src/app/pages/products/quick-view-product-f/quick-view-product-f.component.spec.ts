import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickViewProductFComponent } from './quick-view-product-f.component';

describe('QuickViewProductFComponent', () => {
  let component: QuickViewProductFComponent;
  let fixture: ComponentFixture<QuickViewProductFComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuickViewProductFComponent]
    });
    fixture = TestBed.createComponent(QuickViewProductFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
