import { Component } from '@angular/core';
import { Product } from 'src/app/models/produits.model';

import { CartService } from 'src/app/services/cart.service';
import { ProduitService } from 'src/app/services/produit.service';
@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.scss']
})
export class ProduitsComponent {
  products: Product[] = [];
  userId = 1;

  constructor(
    private productService: ProduitService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: data => this.products = data,
      error: err => console.error('Failed to load products', err)
    });
  }

  addToCart(product: Product) {
    this.cartService.addItemToCart(this.userId, product.id, 1).subscribe({
      next: () => alert(`${product.name} added to cart!`),
      error: err => console.error('Add to cart failed', err)
    });
  }
}
