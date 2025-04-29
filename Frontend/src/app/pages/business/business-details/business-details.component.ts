import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GestionDesBusinessService } from 'src/app/services/services';
import { GetBusinessById$Params } from 'src/app/services/fn/gestion-des-business/get-business-by-id';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Business {
  idBusiness: number;
  name: string;
  description: string;
  categorieBusiness: string;
  logo?: string;
  averageRating: number;
  ratingCount: number;
  instagramPageName?: string;
  businessPdf?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

@Component({
  selector: 'app-business-details',
  templateUrl: './business-details.component.html',
  styleUrls: ['./business-details.component.scss']
})
export class BusinessDetailsComponent implements OnInit {
  business: Business | null = null;
  qrCodeUrl: string | null = null;
  loading = true;
  error: string | null = null;
  baseUrl: string = 'http://localhost:8080/Growthnest';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private businessService: GestionDesBusinessService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('idB');
    if (id) {
      this.loadBusinessDetails(id);
    } else {
      this.error = 'ID de l\'entreprise non fourni.';
      this.loading = false;
      this.snackBar.open(this.error, 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
      console.error('No business ID provided in route');
    }
  }

  loadBusinessDetails(id: string): void {
    const idB = parseInt(id, 10);
    if (isNaN(idB)) {
      this.error = 'ID de l\'entreprise invalide.';
      this.loading = false;
      this.snackBar.open(this.error, 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
      console.error('Invalid business ID:', id);
      return;
    }
    const params: GetBusinessById$Params = { idB };
    this.businessService.getBusinessById(params).subscribe({
      next: (data) => {
        this.business = data;
        this.loading = false;
        this.loadQRCode(idB);
        console.log('Business chargé:', data);
        console.log('Logo URL:', this.getLogoUrl(data.logo));
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des détails de l\'entreprise.';
        this.loading = false;
        this.snackBar.open(this.error, 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
        console.error('Échec du chargement du business:', err);
      }
    });
  }

  loadQRCode(businessId: number): void {
    this.businessService.getQRCodeForBusiness({ id: businessId, width: 200, height: 200 }).subscribe({
      next: (blob) => {
        this.qrCodeUrl = URL.createObjectURL(blob);
      },
      error: (err) => {
        this.qrCodeUrl = null;
        console.error('Erreur lors du chargement du QR Code:', err);
      }
    });
  }

  downloadPdf(): void {
    if (this.business && this.business.idBusiness) {
      const business = this.business;
      this.businessService.downloadBusinessPdf({ id: business.idBusiness }).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = business.businessPdf ?? `business-${business.idBusiness}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          console.log('PDF download initiated');
        },
        error: (err) => {
          console.error('Erreur lors du téléchargement du PDF:', err);
          this.snackBar.open('Impossible de télécharger le PDF.', 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
        }
      });
    }
  }

  refreshBusiness(): void {
    const id = this.route.snapshot.paramMap.get('idB');
    if (id) {
      console.log('Refreshing business with ID:', id);
      this.loadBusinessDetails(id);
    } else {
      console.error('Cannot refresh: No business ID');
      this.snackBar.open('Impossible de rafraîchir les détails.', 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
    }
  }

  viewProducts(businessId: number): void {
    if (businessId) {
      this.router.navigate(['/business', businessId, 'products']);
    } else {
      console.error('ID Business non trouvé:', this.business);
      this.snackBar.open('ID de l\'entreprise non trouvé.', 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
    }
  }

  getLogoUrl(logo: string | undefined): string {
    const logoFilename = logo?.split('/').pop() ?? 'default.jpg';
    return logo ? `${this.baseUrl}/uploads/logos/${logoFilename}` : 'assets/images/banner-07.jpg';
  }

  onImageError(event: Event, business: Business): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/banner-07.jpg';
    business.logo = '';
  }

  onRatingSubmitted(): void {
    this.refreshBusiness();
  }
}