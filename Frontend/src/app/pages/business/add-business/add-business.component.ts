import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AddBusiness$Params } from 'src/app/services/fn/gestion-des-business/add-business';
import { Business } from 'src/app/services/models';
import { CategorieBusiness } from 'src/app/services/models/businessCategory';
import { GestionDesBusinessService } from 'src/app/services/services';

// Déclaration de l'enum


@Component({
  selector: 'app-add-business',
  templateUrl: './add-business.component.html',
  styleUrls: ['./add-business.component.scss']
})
export class AddBusinessComponent {
  businessForm: FormGroup;
  categories = Object.values(CategorieBusiness); // Utilisation de l'enum

  constructor(
    private fb: FormBuilder,
    private businessService: GestionDesBusinessService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.businessForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(255)
      ]],
      categorieBusiness: [null as keyof typeof CategorieBusiness | null, Validators.required]
    });
  }

  onSubmit() {
    if (this.businessForm.valid) {
      const businessData: AddBusiness$Params = {
        body: {
          name: this.businessForm.value.name,
          description: this.businessForm.value.description,
          categorieBusiness: this.businessForm.value.categorieBusiness,
          logo: this.businessForm.value.logo,
          idBusiness:this.businessForm.value.idBusiness
        }
      };
      this.businessService.addBusiness(businessData).subscribe({
        next: (newBusiness:Business) => {
          console.log('Nouveau business créé:', newBusiness);
          this.businessService.triggerRefresh();
          this.router.navigate(['/admin/my-business',newBusiness.idBusiness],{
            state: { freshCreation: true }
          })
          this.businessForm.reset();
        },
        error: (err) => { 
          console.error('Erreur détaillée:', err);
          this.handleError(err);
          this.businessForm.enable(); }
      });
    }
    else {
      this.markFormAsTouched();
    }
  }
  // Méthode de gestion d'erreur
private handleError(error: any): void {
  let errorMessage = 'Erreur lors de la création du business';
  if (error.error?.message) {
    errorMessage += ` : ${error.error.message}`;
  }
  this.snackBar.open(errorMessage, 'Fermer', {
    duration: 5000,
    panelClass: ['error-snackbar']
  });
}

// Marquer tous les champs comme touchés pour afficher les erreurs
private markFormAsTouched(): void {
  Object.values(this.businessForm.controls).forEach(control => {
    control.markAsTouched();
  });
  

}
// Getters avec typage explicite
get name(): FormControl {
  return this.businessForm.get('name') as FormControl;
}

get description(): FormControl {
  return this.businessForm.get('description') as FormControl;
}

get categorieBusiness(): FormControl { // Renommage pour éviter le conflit
  return this.businessForm.get('categorieBusiness') as FormControl;
}
}