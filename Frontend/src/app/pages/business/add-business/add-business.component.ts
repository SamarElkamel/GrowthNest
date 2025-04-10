import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    private router: Router
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
      this.businessService.addBusiness({ body: this.businessForm.value }).subscribe({
        next: (newBusiness) => {
          this.businessService.triggerRefresh();
          this.router.navigate(['/listBusiness']);
        },
        error: (err) => console.error('Erreur création', err)
      });
    }
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