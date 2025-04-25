import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { GestionDesProduitsService } from 'src/app/services/services';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;
  businessId!: number;
  isLoading = false;
  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: GestionDesProduitsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('idBusiness');
    if (id) {
      this.businessId = +id;
    } else {
      console.error('Business ID not provided');
      this.snackBar.open('Business ID not provided', 'Close', { duration: 5000 });
      return;
    }

    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      stock: [null, [Validators.required, Validators.min(0)]]
    });
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.isLoading = true;
      const formData = new FormData();
      const productData = {
        name: this.productForm.value.name,
        description: this.productForm.value.description,
        price: this.productForm.value.price,
        stock: this.productForm.value.stock
      };
      formData.append('product', JSON.stringify(productData));
      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }

      this.productService.addBusinessProductWithImage({
        businessId: this.businessId,
        formData: formData
      }).subscribe({
        next: (res: any) => {
          this.snackBar.open('Product added successfully', 'Close', { duration: 3000 });
          this.router.navigate(['admin/my-business', this.businessId]);
        },
        error: (err) => {
          console.error('Detailed error:', err);
          let errorMessage = 'Error adding product';
          if (err.status === 403) {
            errorMessage += ': Access forbidden (security issue)';
          } else if (err.status === 400) {
            errorMessage += ': Invalid product data';
          }
          this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}