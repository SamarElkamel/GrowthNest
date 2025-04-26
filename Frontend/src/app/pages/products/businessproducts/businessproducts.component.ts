import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Products } from 'src/app/services/models';
import { GestionDesProduitsService } from 'src/app/services/services/gestion-des-produits.service';
import { QuickViewProductFComponent } from '../quick-view-product-f/quick-view-product-f.component';
import * as $ from 'jquery';
import 'isotope-layout';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { WishlistService } from 'src/app/services/services/WishlistService';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-businessproducts',
  templateUrl: './businessproducts.component.html',
  styleUrls: ['./businessproducts.component.scss']
})
export class BusinessproductsComponent implements OnInit, OnDestroy {
  businessId!: number;
  products: Products[] = [];
  filteredProducts: Products[] = [];
  searchQuery: string = '';
  sortBy: string = 'default';
  showFilter: boolean = false;
  showSearch: boolean = false;
  isLoading: boolean = true;
  errorMessage?: string;
  baseUrl: string = 'http://localhost:8080/Growthnest';
  currentUserId!: number; // Utilisateur statique
  wishlist: Set<number> = new Set();
  private wishlistSubscription!: Subscription;

  constructor(
    private tokenService : TokenService,
    private route: ActivatedRoute,
    private produitsService: GestionDesProduitsService,
    private wishlistService: WishlistService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUserId = Number(this.tokenService.getUserId());
    this.route.params.subscribe(params => {
      this.businessId = +params['businessId'];
      this.loadProducts();
      this.loadWishlist();
      this.initializeJQuery();
    });
  }

  ngOnDestroy(): void {
    if (this.wishlistSubscription) {
      this.wishlistSubscription.unsubscribe();
    }
  }

  private loadProducts(): void {
    this.isLoading = true;
    this.produitsService.getProductsByBusiness({ businessId: this.businessId }).subscribe({
      next: (products) => {
        console.log('Produits reçus:', products);
        this.products = products;
        this.filteredProducts = [...this.products];
        this.isLoading = false;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des produits';
        this.isLoading = false;
        console.error('Erreur complète:', err);
      }
    });
  }

  private loadWishlist(): void {
    this.wishlistSubscription = this.wishlistService.wishlistItems$.subscribe({
      next: (wishlistItems) => {
        this.wishlist = new Set(wishlistItems.map(item => item.idProduct));
        console.log('BusinessproductsComponent: Wishlist updated:', Array.from(this.wishlist));
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('BusinessproductsComponent: Error loading wishlist:', err);
      }
    });
  }

  addToWishlist(product: Products): void {
    if (!product.idProduct) return;

    if (this.wishlist.has(product.idProduct)) {
      // Supprimer de la wishlist
      this.wishlistService.removeFromWishlist(product.idProduct);
      Swal.fire(product.name, 'Retiré de la wishlist !', 'info');
    } else {
      // Ajouter à la wishlist
      this.wishlistService.addToWishlist(product.idProduct);
      Swal.fire(product.name, 'Ajouté à la wishlist !', 'success');
    }
  }

  isInWishlist(productId: number | undefined): boolean {
    return productId ? this.wishlist.has(productId) : false;
  }

  searchProducts(): void {
    this.applyFilters();
  }

  sortProducts(event: MouseEvent, sortOption: string): void {
    event.preventDefault();
    this.sortBy = sortOption;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.products];
    if (this.searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    switch (this.sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      default:
        break;
    }
    this.filteredProducts = result;
    this.cdr.detectChanges();
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
    if (this.showFilter) this.showSearch = false;
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
    if (this.showSearch) this.showFilter = false;
  }

  addToCart(product: Products): void {
    Swal.fire('Info', `${product.name} ajouté au panier !`, 'info');
  }

  openQuickView(product: Products): void {
    if (product.idProduct) {
      this.dialog.open(QuickViewProductFComponent, {
        data: { productId: product.idProduct },
        width: '1000px',
        panelClass: 'quick-view-dialog'
      });
    }
  }

  private initializeJQuery(): void {
    setTimeout(() => {
      // Initialiser Isotope pour la grille
      ($('.isotope-grid') as any).isotope({
        itemSelector: '.isotope-item',
        layoutMode: 'fitRows'
      });
    }, 100);
  }

  getLogoUrl(logo: string | null | undefined): string {
    return logo ? `${this.baseUrl}/uploads/products/${logo.split('/').pop()}` : 'assets/images/banner-07.jpg';
  }

  onImageError(event: Event, business: Products): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/banner-07.jpg';
    business.image = '';
  }
}