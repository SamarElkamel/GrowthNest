import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponAnalyticsComponent } from './coupon-analytics.component';

describe('CouponAnalyticsComponent', () => {
  let component: CouponAnalyticsComponent;
  let fixture: ComponentFixture<CouponAnalyticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CouponAnalyticsComponent]
    });
    fixture = TestBed.createComponent(CouponAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
