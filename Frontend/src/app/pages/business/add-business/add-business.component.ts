import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Business, CategorieBusiness } from 'src/app/services/models';
import { GestionDesBusinessService } from 'src/app/services/services';
import { TokenService } from 'src/app/services/token/token.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-business',
  templateUrl: './add-business.component.html',
  styleUrls: ['./add-business.component.scss'],
})
export class AddBusinessComponent {
  businessForm: FormGroup;
  categories = Object.values(CategorieBusiness);
  logoPreview: string | null = null;
  pdfName: string | null = null;
  isSubmitting = false;
  progressPercentage: any;

  constructor(
    private fb: FormBuilder,
    private businessService: GestionDesBusinessService,
    private router: Router,
    private snackBar: MatSnackBar,
    private tokenService: TokenService // Inject TokenService
  ) {
    this.businessForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(255)]],
      categorieBusiness: [null as keyof typeof CategorieBusiness | null, Validators.required],
      instagramPageName: ['', [Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9._]*$/)]],
      logo: [null],
      pdf: [null]
    });
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        this.handleError({ error: { message: 'Veuillez sélectionner une image valide (JPEG, PNG, etc.).' } });
        this.businessForm.get('logo')?.setValue(null);
        this.logoPreview = null;
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.handleError({ error: { message: "L'image ne doit pas dépasser 5 Mo." } });
        this.businessForm.get('logo')?.setValue(null);
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

  onPdfSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type !== 'application/pdf') {
        this.handleError({ error: { message: 'Veuillez sélectionner un fichier PDF valide.' } });
        this.businessForm.get('pdf')?.setValue(null);
        this.pdfName = null;
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        this.handleError({ error: { message: 'Le PDF ne doit pas dépasser 10 Mo.' } });
        this.businessForm.get('pdf')?.setValue(null);
        this.pdfName = null;
        return;
      }
      this.pdfName = file.name;
      this.businessForm.get('pdf')?.setValue(file);
    }
  }

  triggerFileInput(field: 'logo' | 'pdf'): void {
    const input = document.getElementById(`${field}Input`) as HTMLInputElement;
    input.click();
  }

  onSubmit(): void {
    if (this.businessForm.valid) {
      this.isSubmitting = true;
      this.businessForm.disable();
      const businessData = {
        name: this.businessForm.value.name,
        description: this.businessForm.value.description,
        categorieBusiness: this.businessForm.value.categorieBusiness,
        instagramPageName: this.businessForm.value.instagramPageName || null,
        averageRating: 0,
        ratingCount: 0
      };
      const logoFile = this.businessForm.get('logo')?.value;
      const pdfFile = this.businessForm.get('pdf')?.value;

      const currentUserId = this.tokenService.getUserId();
      console.log('Submitting business:', JSON.stringify(businessData));
      console.log('Logo file:', logoFile ? `${logoFile.name} (type: ${logoFile.type})` : 'None');
      console.log('PDF file:', pdfFile ? `${pdfFile.name} (type: ${pdfFile.type})` : 'None');
      console.log('Current user ID:', currentUserId);

      this.businessService.addBusiness(businessData, logoFile, pdfFile).subscribe({
        next: (newBusiness: Business) =>  {
          Swal.fire({
            title: 'Succès',
            text: 'Business créé avec succès ! En attente de validation.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.resetForm();
            this.router.navigate(['/my-businesses']);
          });
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Erreur détaillée:', {
            status: err.status,
            statusText: err.statusText,
            url: err.url,
            headers: err.headers ? Object.fromEntries(err.headers.normalizedNames) : 'No headers',
            error: err.error,
            message: err.message
          });
          Swal.fire('Erreur', 'Une erreur est survenue lors de la création du business.', 'error');
          this.isSubmitting = false;
          this.businessForm.enable();
        }
      });
     
    } else {
      this.markFormAsTouched();
    }
  }

  private resetForm(): void {
    this.businessForm.reset({
      name: '',
      description: '',
      categorieBusiness: null,
      instagramPageName: '',
      logo: null,
      pdf: null
    });
    this.logoPreview = null;
    this.pdfName = null;
    const logoInput = document.getElementById('logoInput') as HTMLInputElement;
    const pdfInput = document.getElementById('pdfInput') as HTMLInputElement;
    if (logoInput) logoInput.value = '';
    if (pdfInput) pdfInput.value = '';
    this.businessForm.enable();
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

  get instagramPageName(): FormControl {
    return this.businessForm.get('instagramPageName') as FormControl;
  }

  get logo(): FormControl {
    return this.businessForm.get('logo') as FormControl;
  }

  get pdf(): FormControl {
    return this.businessForm.get('pdf') as FormControl;
  }
}