
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GestionDesBusinessService } from 'src/app/services/services';
import { Business, CategorieBusiness } from 'src/app/services/models';
import { HttpErrorResponse } from '@angular/common/http';

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
  isSubmitting = false;
  baseUrl: string = 'http://localhost:8080/Growthnest';

  constructor(
    public dialogRef: MatDialogRef<UpdateBusinessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Business,
    private fb: FormBuilder,
    private businessService: GestionDesBusinessService,
    private snackBar: MatSnackBar
  ) {
    this.businessForm = this.fb.group({
      idBusiness: [data.idBusiness, Validators.required],
      name: [data.name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: [data.description, [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
      categorieBusiness: [data.categorieBusiness, Validators.required],
      instagramPageName: [data.instagramPageName, [Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9._]*$/)]],
      logo: [null],
      pdf: [null]
    });
    this.existingLogoUrl = data.logo ? data.logo.replace(/^http:\/\/localhost:8080\/?/, '/uploads/') : null;
    this.existingPdfName = data.businessPdf || null;
    this.logoPreview = data.logo ? `${this.businessService.getBaseUrl()}${this.existingLogoUrl}` : null;
    this.pdfName = data.businessPdf || null;
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        this.snackBar.open('Veuillez sélectionner une image valide (JPEG, PNG, etc.).', 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('Le logo ne doit pas dépasser 5 Mo.', 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => (this.logoPreview = reader.result as string);
      reader.readAsDataURL(file);
      this.businessForm.patchValue({ logo: file });
    }
  }

  onPdfSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      if (file.type !== 'application/pdf') {
        this.snackBar.open('Veuillez sélectionner un fichier PDF valide.', 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        this.snackBar.open('Le PDF ne doit pas dépasser 10 Mo.', 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        return;
      }
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
      this.isSubmitting = true;
      this.businessForm.disable();

      const businessData = {
        idBusiness: this.businessForm.value.idBusiness,
        name: this.businessForm.value.name,
        description: this.businessForm.value.description,
        categorieBusiness: this.businessForm.value.categorieBusiness,
        instagramPageName: this.businessForm.value.instagramPageName || null,
        logo: this.businessForm.value.logo ? null : this.existingLogoUrl,
        businessPdf: this.businessForm.value.pdf ? null : this.existingPdfName,
      };

      console.log('Submitting businessData:', JSON.stringify(businessData));

      const formData = new FormData();
      formData.append('business', JSON.stringify(businessData));
      if (this.businessForm.value.logo) {
        formData.append('logo', this.businessForm.value.logo, this.businessForm.value.logo.name);
      }
      if (this.businessForm.value.pdf) {
        formData.append('pdf', this.businessForm.value.pdf, this.businessForm.value.pdf.name);
      }

      // Debug FormData content
      formData.forEach((value, key) => {
        if (key === 'business') {
          console.log(`FormData ${key}:`, value);
        } else {
          console.log(`FormData ${key}:`, (value as File).name || 'null');
        }
      });

      this.businessService.updateBusinessWithFiles(formData).subscribe({
        next: (updatedBusiness) => {
          this.snackBar.open('Business mis à jour avec succès !', 'Fermer', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          
          this.dialogRef.close(updatedBusiness);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Update error:', err);
          let errorMessage = 'Erreur lors de la mise à jour du business.';
          if (err.status === 400 && err.error?.error) {
            errorMessage = err.error.error;
            console.error('Backend error message:', errorMessage);
          } else if (err.status === 403) {
            errorMessage = 'Vous n\'êtes pas autorisé à modifier ce business.';
          } else if (err.status === 404) {
            errorMessage = 'Business non trouvé.';
          }
          this.snackBar.open(errorMessage, 'Fermer', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.isSubmitting = false;
          this.businessForm.enable();
        }
      });
    } else {
      this.snackBar.open('Veuillez corriger les erreurs dans le formulaire.', 'Fermer', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      this.markFormAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(controlName: string): string {
    const control = this.businessForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Ce champ est requis';
    }
    if (control?.hasError('minlength')) {
      return `Minimum ${control.errors?.['minlength'].requiredLength} caractères`;
    }
    if (control?.hasError('maxlength')) {
      return `Maximum ${control.errors?.['maxlength'].requiredLength} caractères`;
    }
    if (control?.hasError('pattern')) {
      return 'Caractères alphanumériques, points ou underscores uniquement';
    }
    return '';
  }

  private markFormAsTouched(): void {
    Object.values(this.businessForm.controls).forEach(control => {
      control.markAsTouched();
    });
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
  getLogoUrl(logo: string | null | undefined): string {
    return logo ? `${this.baseUrl}/uploads/logos/${logo.split('/').pop()}` : 'assets/images/banner-07.jpg';
  }
}
