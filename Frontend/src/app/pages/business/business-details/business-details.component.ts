import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GestionDesBusinessService } from 'src/app/services/services';
import { GetBusinessById$Params } from 'src/app/services/fn/gestion-des-business/get-business-by-id';

export interface Business {
  idBusiness: number;
  name: string;
  description: string;
  categorieBusiness: string;
  logo?: string;
  bannerImage?: string;
  image1?: string;
  averageRating: number;
  ratingCount: number;
  instagramPageName?: string;
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
    private businessService: GestionDesBusinessService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('idB');
    if (id) {
      this.loadBusinessDetails(id);
    } else {
      this.error = 'ID de l\'entreprise non fourni.';
      this.loading = false;
    }
  }

  loadBusinessDetails(id: string): void {
    const idB = parseInt(id, 10);
    if (isNaN(idB)) {
      this.error = 'ID de l\'entreprise invalide.';
      this.loading = false;
      return;
    }
    const params: GetBusinessById$Params = { idB };
    this.businessService.getBusinessById(params).subscribe({
      next: (data) => {
        this.business = data;
        this.loading = false;
        // Load QR Code after business details
        this.loadQRCode(idB);
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des détails de l\'entreprise.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadQRCode(businessId: number): void {
    this.businessService.getQRCodeForBusiness({ id: businessId, width: 200, height: 200 }).subscribe({
      next: (blob) => {
        this.qrCodeUrl = URL.createObjectURL(blob);
      },
      error: (err) => {
        this.qrCodeUrl = null; // Ensure QR Code doesn’t display
        console.error('Erreur lors du chargement du QR Code:', err);
      }
    });
  }

  refreshBusiness(): void {
    const id = this.route.snapshot.paramMap.get('idB');
    if (id) {
      this.loadBusinessDetails(id);
    }
  }

  viewProducts(businessId: number): void {
    if (businessId) {
      this.router.navigate(['/business', businessId, 'products']);
    } else {
      console.error('ID Business non trouvé:', this.business);
    }
  }

  getLogoUrl(logo: string | undefined): string {
    return logo ? `${this.baseUrl}${logo}` : 'assets/images/banner-07.jpg';
  }

  onImageError(event: Event, business: Business): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/banner-07.jpg';
    business.image1 = ''; // Clear image1 to prevent repeated attempts
  }
}