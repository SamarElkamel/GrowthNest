import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Business, CategorieBusiness } from 'src/app/services/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-business-dialog',
  templateUrl: './update-business-dialog.component.html',
  styleUrls: ['./update-business-dialog.component.scss']
})
export class UpdateBusinessDialogComponent {
  businessForm: FormGroup;
  categorieBusinessOptions = Object.values(CategorieBusiness);

  constructor(
    public dialogRef: MatDialogRef<UpdateBusinessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Business,
    private fb: FormBuilder
  ) {
    // Initialisation du formulaire avec les validations
    this.businessForm = this.fb.group({
      idBusiness: [data.idBusiness],
      name: [data.name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: [data.description, [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
      categorieBusiness: [data.categorieBusiness, Validators.required],
      logo: [data.logo || null] // Gère le cas où logo est null
    });
    console.log('Business initial :', this.businessForm.value);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.businessForm.valid) {
      console.log('Business sauvegardé :', this.businessForm.value);
      this.dialogRef.close(this.businessForm.value);
    }
  }

  // Accesseurs pour les contrôles du formulaire
  get name() { return this.businessForm.get('name'); }
  get description() { return this.businessForm.get('description'); }
  get categorieBusiness() { return this.businessForm.get('categorieBusiness'); }
}