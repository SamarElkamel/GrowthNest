import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { GestionDesProduitsService } from 'src/app/services/services';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {
  productForm!: FormGroup;
  businessId!: number;
  isLoading = false;

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
      console.error('ID du business non fourni');
      return;
    }

    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      stock: [null, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.isLoading = true;
      const productData = {
        name: this.productForm.get('name')?.value,
        description: this.productForm.get('description')?.value,
        price: this.productForm.get('price')?.value,
        stock: this.productForm.get('stock')?.value
      };

      console.log('Données envoyées :', productData);

      this.productService.addBusinessProduct({ businessId: this.businessId,body: productData}).subscribe({
        next: (res: any) => {
          this.snackBar.open('Produit ajouté avec succès', 'Fermer', { duration: 3000 });
          this.router.navigate(['admin/my-business', this.businessId]);
        },
        error: (err) => {
          console.error('Erreur détaillée :', err);
          let errorMessage = 'Erreur lors de l\'ajout du produit';
          if (err.status === 403) {
            errorMessage += ' : Accès interdit (problème de sécurité)';
          }
          this.snackBar.open(errorMessage, 'Fermer', { duration: 5000 });
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}