import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { Business, Products } from 'src/app/services/models';
import { GestionDesBusinessService, GestionDesProduitsService } from 'src/app/services/services';
import { UpdateBusinessDialogComponent } from '../update-business-dialog/update-business-dialog.component'; // Ajouté
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
  isLoading = true;
  isLoadingProducts = false;
  displayedColumns: string[] = ['name', 'description', 'price', 'stock', 'image', 'update', 'delete'];
  private destroy$ = new Subject<void>();
  baseUrl: string = 'http://localhost:8080/Growthnest';

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
      console.error('ID du business non fourni');
      this.isLoading = false;
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
        },
        error: (err) => {
          console.error('Erreur lors du chargement du business', err);
          this.isLoading = false;
          this.snackBar.open('Erreur lors du chargement du business', 'Fermer', { duration: 3000 });
        }
      });
  }

  loadProducts(): void {
    if (!this.business?.idBusiness) return;

    this.isLoadingProducts = true;
    this.productService
      .getProductsByBusiness({ businessId: this.business.idBusiness })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          this.products = products;
          this.isLoadingProducts = false;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des produits', err);
          this.snackBar.open('Erreur lors du chargement des produits', 'Fermer', { duration: 3000 });
          this.isLoadingProducts = false;
        }
      });
  }

  deleteProduct(idP: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.isLoadingProducts = true;
      this.productService.deleteProductById({ idP }).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.idProduct !== idP);
          this.snackBar.open('Produit supprimé avec succès', 'Fermer', { duration: 3000 });
          this.isLoadingProducts = false;
        },
        error: (err) => {
          console.error('Erreur de suppression', err);
          this.snackBar.open('Erreur lors de la suppression du produit', 'Fermer', { duration: 3000 });
          this.isLoadingProducts = false;
        }
      });
    }
  }

  updateProduct(product: Products): void {
    const dialogRef = this.dialog.open(UpdateProductDialogComponent, {
      width: '400px',
      data: product,
      autoFocus: true, // Focus automatique sur le premier champ du dialogue
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
              this.products = [...this.products];
            }
            this.snackBar.open('Produit mis à jour avec succès', 'Fermer', { duration: 3000 });
            this.isLoadingProducts = false;
          },
          error: (err) => {
            console.error('Erreur lors de la mise à jour du produit', err);
            this.snackBar.open('Erreur lors de la mise à jour du produit', 'Fermer', { duration: 3000 });
            this.isLoadingProducts = false;
          }
        });
      }
    });
  }

  updateBusiness(): void {
    if (!this.business) return;
  
    const dialogRef = this.dialog.open(UpdateBusinessDialogComponent, {
      width: '400px',
      data: this.business,
      autoFocus: true, // Focus automatique sur le premier champ du dialogue
      restoreFocus: true
    });
  
    dialogRef.afterClosed().subscribe((updatedBusiness: Business | undefined) => {
      if (updatedBusiness) {
        console.log('Business envoyé :', updatedBusiness);
        this.isLoading = true;
        this.businessService.updateBusiness({ body: updatedBusiness }).pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          next: (result) => {
            this.business = result;
            this.snackBar.open('Business mis à jour avec succès', 'Fermer', { duration: 3000 });
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Erreur détaillée :', err); // Ajoute ce log
            this.snackBar.open('Erreur lors de la mise à jour du business : ' + err.statusText, 'Fermer', { duration: 3000 });
            this.isLoading = false;
          }
        });
      }
    });
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}