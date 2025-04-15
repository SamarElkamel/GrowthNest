import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AddBusiness$Params } from 'src/app/services/fn/gestion-des-business/add-business';
import { Business, CategorieBusiness } from 'src/app/services/models';
import { GestionDesBusinessService } from 'src/app/services/services';

@Component({
  selector: 'app-add-business',
  templateUrl: './add-business.component.html',
  styleUrls: ['./add-business.component.scss'],
})
export class AddBusinessComponent {
  businessForm: FormGroup;
  categories = Object.values(CategorieBusiness);
  logoPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private businessService: GestionDesBusinessService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.businessForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
      categorieBusiness: [null as keyof typeof CategorieBusiness | null, Validators.required],
      logo: [''],
    });
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        this.handleError({ error: { message: 'Veuillez sélectionner une image valide (JPEG, PNG, etc.).' } });
        this.businessForm.get('logo')?.setValue('');
        this.logoPreview = null;
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        this.handleError({ error: { message: "L'image ne doit pas dépasser 2 Mo." } });
        this.businessForm.get('logo')?.setValue('');
        this.logoPreview = null;
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result as string;
      };
      reader.onerror = () => {
        this.handleError({ error: { message: 'Erreur lors de la lecture du logo.' } });
        this.logoPreview = null;
      };
      reader.readAsDataURL(file);
      this.businessForm.get('logo')?.setValue(file);
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('logoInput') as HTMLInputElement;
    fileInput.click();
  }

  async onSubmit(): Promise<void> {
    if (this.businessForm.valid) {
      try {
        this.businessForm.disable();
        let logoPath: string = ''; // Explicitly typed as string

        // Upload logo if a file is selected
        const logoControl = this.businessForm.get('logo');
        if (logoControl?.value instanceof File) {
          const path = await this.businessService
            .uploadLogo({ body: logoControl.value })
            .toPromise();
          logoPath = path ?? ''; // Handle potential undefined
        }

        // Prepare business data
        const businessData: AddBusiness$Params = {
          body: {
            name: this.businessForm.value.name,
            description: this.businessForm.value.description,
            categorieBusiness: this.businessForm.value.categorieBusiness,
            logo: logoPath,
            averageRating: 0.0,
            ratingCount: 0,
          },
        };

        // Add business
        this.businessService.addBusiness(businessData).subscribe({
          next: (newBusiness: Business) => {
            this.snackBar.open('Business créé avec succès !', 'Fermer', {
              duration: 3000,
              panelClass: ['success-snackbar'],
            });
            this.businessService.triggerRefresh();
            this.router.navigate(['/admin/my-business', newBusiness.idBusiness], {
              state: { freshCreation: true },
            });
            this.businessForm.reset();
            this.logoPreview = null;
            const fileInput = document.getElementById('logoInput') as HTMLInputElement;
            fileInput.value = '';
            this.businessForm.enable();
          },
          error: (err) => {
            console.error('Erreur détaillée:', err);
            this.handleError(err);
            this.businessForm.enable();
          },
        });
      } catch (err) {
        this.handleError(err);
        this.businessForm.enable();
      }
    } else {
      this.markFormAsTouched();
    }
  }

  private handleError(error: any): void {
    let errorMessage = 'Erreur lors de la création du business';
    if (error.error?.message) {
      errorMessage += ` : ${error.error.message}`;
    } else if (error.message) {
      errorMessage += ` : ${error.message}`;
    }
    this.snackBar.open(errorMessage, 'Fermer', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }

  private markFormAsTouched(): void {
    Object.values(this.businessForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  get name(): FormControl {
    return this.businessForm.get('name') as FormControl;
  }

  get description(): FormControl {
    return this.businessForm.get('description') as FormControl;
  }

  get categorieBusiness(): FormControl {
    return this.businessForm.get('categorieBusiness') as FormControl;
  }

  get logo(): FormControl {
    return this.businessForm.get('logo') as FormControl;
  }
}