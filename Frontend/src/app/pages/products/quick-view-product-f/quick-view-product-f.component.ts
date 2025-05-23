import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GetProductById$Params } from 'src/app/services/fn/gestion-des-produits/get-product-by-id';
import { Products } from 'src/app/services/models';
import { GestionDesProduitsService } from 'src/app/services/services';
import { CartService } from 'src/app/services/services/cart.service';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-quick-view-product-f',
  templateUrl: './quick-view-product-f.component.html',
  styleUrls: ['./quick-view-product-f.component.scss']
})
export class QuickViewProductFComponent {
  product: Products | null = null; 
  products: Products[] = [];
  userId! : number;
// Initialisation explicite
  isLoading = true;
  baseUrl: string = 'http://localhost:8080/Growthnest';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { productId: number },
    private productService: GestionDesProduitsService,
    public dialogRef: MatDialogRef<QuickViewProductFComponent>,
    private cartService: CartService,
    private tokenService:TokenService
  ) {}

  ngOnInit(): void { 
    this.userId = Number(this.tokenService.getUserId());
    this.loadProduct();
  }

  loadProduct() {
    // Créer l'objet params requis
    const params: GetProductById$Params = { 
      idP: this.data.productId 
    };
  
    this.productService.getProductById(params).subscribe({ // <-- Passer l'objet params
      next: (res) => {
        this.product = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.isLoading = false;
      }
    });
  }
  close() {
    this.dialogRef.close();
  }
  
  quantity = 1;

  // ... constructor et autres méthodes

  adjustQuantity(change: number) {
    const newQuantity = this.quantity + change;
    if (newQuantity >= 1 && newQuantity <= (this.product?.stock || 1)) {
      this.quantity = newQuantity;
    }
  }
  addToCart(product: Products) {
    this.cartService.addItemToCart(this.userId, product.idProduct, 1).subscribe({
      next: () => alert(`${product.name} added to cart!`),
      error: err => console.error('Add to cart failed', err)
    });
  }
  

  private showAddedToCartNotification() {
    // Vous pouvez utiliser un snackbar Material ici
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
      <mat-icon>check_circle</mat-icon>
      Ajouté au panier
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 2000);
  }
  getLogoUrl(logo: string | null | undefined): string {
    // Use lowercase 'uploads' in the URL path
    return logo ? `${this.baseUrl}/uploads/products/${logo.split('/').pop()}` : 'assets/images/banner-07.jpg';
  }
  
  onImageError(event: Event, business: Products): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/banner-07.jpg';
    business.image = ''; // Prevent repeated failed attempts
  }
 
}
