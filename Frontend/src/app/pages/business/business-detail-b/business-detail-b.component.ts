import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { Business, Products } from 'src/app/services/models';
import { GestionDesBusinessService, GestionDesProduitsService } from 'src/app/services/services';
import { UpdateBusinessDialogComponent } from '../update-business-dialog/update-business-dialog.component';
import { UpdateProductDialogComponent } from '../../products/update-product-dialog/update-product-dialog.component';

@Component({
  selector: 'app-business-detail-b',
  templateUrl: './business-detail-b.component.html',
  styleUrls: ['./business-detail-b.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        animate('0.5s ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class BusinessDetailBComponent implements OnInit, OnDestroy {
  business?: Business;
  products: Products[] = [];
  filteredProducts: Products[] = [];
  isLoading = true;
  isLoadingProducts = false;
  displayedColumns: string[] = ['name', 'description', 'price', 'stock', 'image', 'update', 'delete'];
  private destroy$ = new Subject<void>();
  baseUrl: string = 'http://localhost:8080/Growthnest';
  sortBy: string = 'name'; // Default sort
  sortDirection: 'asc' | 'desc' = 'asc';
  searchQuery: string = '';

  constructor(
    private route: ActivatedRoute,
    private businessService: GestionDesBusinessService,
    private productService: GestionDesProduitsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('idBusiness');
    if (id) {
      this.loadBusiness(+id);
    } else {
      console.error('Business ID not provided');
      this.isLoading = false;
      this.snackBar.open('Failed to load business details: ID not provided', 'Close', { duration: 3000 });
    }
  }

  private loadBusiness(id: number): void {
    this.isLoading = true;
    this.businessService
      .getBusinessById({ idB: id })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.business = res;
          this.isLoading = false;
          // Only load products if status is APPROVED
          if (this.isStatusApproved()) {
            this.loadProducts();
          }
        },
        error: (err) => {
          console.error('Error loading business', err);
          this.isLoading = false;
          this.snackBar.open('Failed to load business details', 'Close', { duration: 3000 });
        }
      });
  }

  private loadProducts(): void {
    if (!this.business?.idBusiness) return;

    this.isLoadingProducts = true;
    this.productService
      .getProductsByBusiness({ businessId: this.business.idBusiness })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          this.products = products;
          this.filteredProducts = [...products];
          this.applyFiltersAndSort();
          this.isLoadingProducts = false;
        },
        error: (err) => {
          console.error('Error loading products', err);
          this.snackBar.open('Failed to load products', 'Close', { duration: 3000 });
          this.isLoadingProducts = false;
        }
      });
  }

  // Helper method to check if status is APPROVED
  isStatusApproved(): boolean {
    return this.business?.status === 'APPROVED';
  }

  deleteProduct(idP: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.isLoadingProducts = true;
      this.productService.deleteProductById({ idP }).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.idProduct !== idP);
          this.filteredProducts = this.filteredProducts.filter(p => p.idProduct !== idP);
          this.snackBar.open('Product deleted successfully', 'Close', { duration: 3000 });
          this.isLoadingProducts = false;
        },
        error: (err) => {
          console.error('Deletion error', err);
          this.snackBar.open('Failed to delete product', 'Close', { duration: 3000 });
          this.isLoadingProducts = false;
        }
      });
    }
  }

  updateProduct(product: Products): void {
    // Only allow updating if status is APPROVED
    if (!this.isStatusApproved()) {
      this.snackBar.open('Cannot update products while business is pending or rejected', 'Close', { duration: 3000 });
      return;
    }

    const dialogRef = this.dialog.open(UpdateProductDialogComponent, {
      width: '500px',
      data: product,
      autoFocus: true,
      restoreFocus: true
    });

    dialogRef.afterClosed().subscribe((updatedProduct: Products | undefined) => {
      if (updatedProduct) {
        this.isLoadingProducts = true;
        this.productService.updateProducts({ body: updatedProduct }).pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          next: (result) => {
            const index = this.products.findIndex(p => p.idProduct === result.idProduct);
            if (index !== -1) {
              this.products[index] = result;
              this.filteredProducts = [...this.products];
              this.applyFiltersAndSort();
            }
            this.snackBar.open('Product updated successfully', 'Close', { duration: 3000 });
            this.isLoadingProducts = false;
          },
          error: (err) => {
            console.error('Error updating product', err);
            this.snackBar.open('Failed to update product', 'Close', { duration: 3000 });
            this.isLoadingProducts = false;
          }
        });
      }
    });
  }

  updateBusiness(): void {
    if (!this.business) return;

    // Prevent updating if status is PENDING or REJECTED
    if (!this.isStatusApproved()) {
      this.snackBar.open('Cannot update business while status is pending or rejected', 'Close', { duration: 3000 });
      return;
    }

    const dialogRef = this.dialog.open(UpdateBusinessDialogComponent, {
      width: '500px',
      data: this.business,
      autoFocus: true,
      restoreFocus: true
    });

    dialogRef.afterClosed().subscribe((updatedBusiness: Business | undefined) => {
      if (updatedBusiness) {
        console.log('Business sent:', updatedBusiness);
        this.isLoading = true;
        this.businessService.updateBusiness({ body: updatedBusiness }).pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          next: (result) => {
            this.business = result;
            this.snackBar.open('Business updated successfully', 'Close', { duration: 3000 });
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Detailed error:', err);
            this.snackBar.open('Failed to update business: ' + err.statusText, 'Close', { duration: 3000 });
            this.isLoading = false;
          }
        });
      }
    });
  }

  getLogoUrl(logo: string | null | undefined): string {
    const logoFilename = logo?.split('/').pop() ?? 'default.jpg';
    return logo ? `${this.baseUrl}/uploads/logos/${logoFilename}` : 'assets/images/default-business.jpg';
  }

  getProductImageUrl(image: string | null | undefined): string {
    const imageFilename = image?.split('/').pop() ?? 'default.jpg';
    return image ? `${this.baseUrl}/uploads/products/${imageFilename}` : 'assets/images/default-product.jpg';
  }

  onImageError(event: Event, item: Business | Products): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'image' in item ? 'assets/images/default-product.jpg' : 'assets/images/default-business.jpg';
    if ('image' in item) {
      item.image = '';
    } else if ('logo' in item) {
      item.logo = '';
    }
  }

  // Sorting and Filtering
  sortProducts(column: string): void {
    if (this.sortBy === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDirection = 'asc';
    }
    this.applyFiltersAndSort();
  }

  filterProducts(): void {
    this.applyFiltersAndSort();
  }

  applyFiltersAndSort(): void {
    let result = [...this.products];
    // Apply search filter
    if (this.searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (this.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = (a.price ?? 0) - (b.price ?? 0);
          break;
        case 'stock':
          comparison = (a.stock ?? 0) - (b.stock ?? 0);
          break;
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
    this.filteredProducts = result;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}