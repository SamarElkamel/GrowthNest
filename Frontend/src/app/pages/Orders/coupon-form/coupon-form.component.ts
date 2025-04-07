import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CouponService } from 'src/app/services/coupon.service';

@Component({
  selector: 'app-coupon-form',
  templateUrl: './coupon-form.component.html'
})
export class CouponFormComponent {
  couponForm: FormGroup;

  constructor(private fb: FormBuilder, private couponService: CouponService) {
    this.couponForm = this.fb.group({
      code: ['', Validators.required],
      discountPercentage: [null, [Validators.required, Validators.min(0.1), Validators.max(100)]],
      expiryDate: ['', Validators.required],
      global: [true],
      productIds: [[]],
      ownerId: [null, Validators.required],
      maxUses: [1, [Validators.required, Validators.min(1)]],
      usageCount: [0]
    });
  }
  loading = false;
  submit() {
    if (this.couponForm.invalid) return;

    const formData = this.couponForm.value;
    this.couponService.create(formData).subscribe(() => {
      alert('Coupon created!');
      this.couponForm.reset({
        global: true,
        maxUses: 1,
        usageCount: 0
      });
    });
  }


 
  onProductIdsInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    const ids = input
      .split(',')
      .map(id => id.trim())
      .filter(id => id !== '')
      .map(id => +id);
    this.couponForm.patchValue({ productIds: ids });
  }
  
}
