import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Products } from 'src/app/services/models';
import { GestionDesProduitsService } from 'src/app/services/services/gestion-des-produits.service';

@Component({
  selector: 'app-businessproducts',
  templateUrl: './businessproducts.component.html',
  styleUrls: ['./businessproducts.component.scss']
})
export class BusinessproductsComponent {
  businessId!: number;
  products: Products[] = [];
  isLoading = true;
  errorMessage?: string;
  constructor(
    private route: ActivatedRoute,
    private produitsService: GestionDesProduitsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.businessId = +params['businessId'];
      this.loadProducts();
    });
  }

  private loadProducts(): void {
    this.produitsService.getProductsByBusiness({ businessId: this.businessId })
      .subscribe({
        next: (products) => {
          console.log('Produits reçus:', products); // 👈 Ajoutez ce log
          this.products = products;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du chargement des produits';
          this.isLoading = false;
          console.error('Erreur complète:', err);
        }
      });
    }
    addToCart(product: Products) {
      // Implémentez la logique d'ajout au panier
    }
  
    quickView(product: Products) {
      // Implémentez la modal de visualisation rapide
    }

}
