import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Products } from 'src/app/services/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-product-dialog',
  templateUrl: './update-product-dialog.component.html',
  styleUrls: ['./update-product-dialog.component.scss']
})
export class UpdateProductDialogComponent {
  productForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<UpdateProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Products,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      idProduct: [data.idProduct],
      name: [data.name, [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      description: [data.description, [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      price: [data.price, [Validators.required, Validators.min(0.01)]],
      stock: [data.stock, [Validators.required, Validators.min(0)]],
      image: [data.image]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.productForm.valid) {
      this.dialogRef.close(this.productForm.value);
    }
  }

  // Méthodes pour afficher les erreurs dans le template
  get name() { return this.productForm.get('name'); }
  get description() { return this.productForm.get('description'); }
  get price() { return this.productForm.get('price'); }
  get stock() { return this.productForm.get('stock'); }
}