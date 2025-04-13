import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Products } from 'src/app/services/models';
import { GestionDesProduitsService } from 'src/app/services/services/gestion-des-produits.service';
import { QuickViewProductFComponent } from '../quick-view-product-f/quick-view-product-f.component';
import * as $ from 'jquery';
import 'isotope-layout'; // Import Isotope to extend jQuery

declare var swal: any;

@Component({
  selector: 'app-businessproducts',
  templateUrl: './businessproducts.component.html',
  styleUrls: ['./businessproducts.component.scss']
})
export class BusinessproductsComponent implements OnInit {
  businessId!: number;
  products: Products[] = [];
  filteredProducts: Products[] = [];
  searchQuery: string = '';
  sortBy: string = 'default';
  showFilter: boolean = false;
  showSearch: boolean = false;
  isLoading: boolean = true;
  errorMessage?: string;

  constructor(
    private route: ActivatedRoute,
    private produitsService: GestionDesProduitsService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.businessId = +params['businessId'];
      this.loadProducts();
      this.initializeJQuery();
    });
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

  searchProducts(): void {
    this.applyFilters();
  }

  sortProducts(sortOption: string): void {
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
    if (this.showFilter) {
      this.showSearch = false;
    }
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
    if (this.showSearch) {
      this.showFilter = false;
    }
  }

  addToWishlist(product: Products): void {
    swal(product.name, "is added to wishlist!", "success");
    // Optionally, add API call to save to wishlist
  }

  addToCart(product: Products): void {
    // Existing placeholder logic
    // Implement cart addition here
  }

  openQuickView(product: Products): void {
    if (product.idProduct) {
      this.dialog.open(QuickViewProductFComponent, {
        data: { productId: product.idProduct },
        width: '800px',
        panelClass: 'quick-view-dialog'
      });
    }
  }

  private initializeJQuery(): void {
    setTimeout(() => {
      // Initialize Isotope for grid filtering
      ($('.isotope-grid') as any).isotope({
        itemSelector: '.isotope-item',
        layoutMode: 'fitRows'
      });

      // Wishlist button interactivity
      $('.js-addwish-b2').each((index: number, element: HTMLElement) => {
        const $element = $(element);
        const nameProduct = $element.parent().parent().find('.js-name-b2').text();
        $element.on('click', (e: JQuery.ClickEvent<HTMLElement>) => {
          e.preventDefault();
          swal(nameProduct, "is added to wishlist!", "success");
          $element.addClass('js-addedwish-b2');
          $element.off('click');
        });
      });
    }, 100);
  }
}