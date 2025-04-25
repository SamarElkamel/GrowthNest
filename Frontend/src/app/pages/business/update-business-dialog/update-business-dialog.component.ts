// update-business-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Business, CategorieBusiness } from 'src/app/services/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GestionDesBusinessService } from 'src/app/services/services';

@Component({
  selector: 'app-update-business-dialog',
  templateUrl: './update-business-dialog.component.html',
  styleUrls: ['./update-business-dialog.component.scss']
})
export class UpdateBusinessDialogComponent {
  businessForm: FormGroup;
  categorieBusinessOptions = Object.values(CategorieBusiness);
  logoPreview: string | null = null;
  pdfName: string | null = null;
  existingLogoUrl: string | null = null;
  existingPdfName: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<UpdateBusinessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Business,
    private fb: FormBuilder,
    private businessService: GestionDesBusinessService
  ) {
    this.businessForm = this.fb.group({
      idBusiness: [data.idBusiness],
      name: [data.name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: [data.description, [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
      categorieBusiness: [data.categorieBusiness, Validators.required],
      instagramPageName: [data.instagramPageName, [Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9._]*$/)]],
      logo: [null],
      pdf: [null]
    });
    this.existingLogoUrl = data.logo 
    ? `${this.businessService.getBaseUrl()}${data.logo}` 
    : null
    this.existingPdfName = data.businessPdf || null;
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => this.logoPreview = reader.result as string;
      reader.readAsDataURL(file);
      this.businessForm.patchValue({ logo: file });
    }
  }

  onPdfSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      this.pdfName = file.name;
      this.businessForm.patchValue({ pdf: file });
    }
  }

  triggerFileInput(field: 'logo' | 'pdf'): void {
    const input = document.getElementById(`${field}Input`) as HTMLInputElement;
    input.click();
  }

  onSave(): void {
    if (this.businessForm.valid) {
      const formData = new FormData();
      const businessData = {
        idBusiness: this.businessForm.value.idBusiness,
        name: this.businessForm.value.name,
        description: this.businessForm.value.description,
        categorieBusiness: this.businessForm.value.categorieBusiness,
        instagramPageName: this.businessForm.value.instagramPageName,
        logo: this.businessForm.value.logo ? null : this.existingLogoUrl,
        businessPdf: this.businessForm.value.pdf ? null : this.existingPdfName
      };
  
      // Exclure les champs protégés
      const safeData = { 
        idBusiness: businessData.idBusiness,
        name: businessData.name,
        description: businessData.description,
        categorieBusiness: businessData.categorieBusiness,
        instagramPageName: businessData.instagramPageName,
        logo: businessData.logo,
        businessPdf: businessData.businessPdf
      };      
      formData.append('business', JSON.stringify(safeData));
      
      if (this.businessForm.value.logo) {
        formData.append('logo', this.businessForm.value.logo);
      }
      
      if (this.businessForm.value.pdf) {
        formData.append('pdf', this.businessForm.value.pdf);
      }
  
      this.businessService.updateBusinessWithFiles(formData).subscribe({
        next: (updatedBusiness) => {
          // Fusionner avec les données existantes pour garder le statut
          const mergedBusiness = { 
            ...this.data, 
            ...updatedBusiness,
            status: this.data.status // Conserver le statut original
          };
          this.dialogRef.close(mergedBusiness);
        },
        error: (err) => {
          console.error('Erreur de mise à jour:', err);
          // Gérer l'erreur
        }
      });
      console.log('Logo URL:', this.existingLogoUrl);
// Doit ressembler à : http://localhost:8080/uploads/logos/fichier.jpg
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  get name() { 
    return this.businessForm.get('name'); 
  }

  get description() { 
    return this.businessForm.get('description'); 
  }

  get instagramPageName() {
    return this.businessForm.get('instagramPageName');
  }

  get categorieBusiness() {
    return this.businessForm.get('categorieBusiness');
  }

}