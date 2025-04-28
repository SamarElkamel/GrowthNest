import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { Business } from 'src/app/services/models';
import { GestionDesBusinessService } from 'src/app/services/services';
import { BusinessDetailCardComponent } from '../../business-detail-card/business-detail-card.component';

@Component({
  selector: 'app-business-list',
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.scss']
})
export class BusinessListComponent implements OnInit {
  businesses: Business[] = [];
  displayedBusinesses: Business[] = [];
  businessesInitiaux: Business[] = [];
  @Input() business: any;
  
  itemsPerPage: number = 5;  // Items per page
  totalPages: number = 1;    // Total pages
  currentPage: number = 1;   // Current page
  pages: number[] = [];      // Pages to display
  selectedRow: number | null = null;
  
  columns = [
    { label: 'Nom', class: 'name-col' },
    { label: 'Catégorie', class: 'category-col' },
    { label: 'Description', class: 'description-col' },
    { label: 'Actions', class: 'actions-col' }
  ];

  constructor(private businessService: GestionDesBusinessService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadBusinesses();
  }

  loadBusinesses() {
    this.businessService.getAllBusiness().subscribe({
      next: (businesses) => {
        this.businesses = businesses;
        this.businessesInitiaux = businesses;
        this.paginate();
      },
      error: (err) => console.error('Error:', err)
    });
  }

  paginate(): void {
    this.totalPages = Math.ceil(this.businesses.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.displayedBusinesses = this.getBusinessesForPage(this.currentPage);
  }

  getBusinessesForPage(page: number): Business[] {
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.businesses.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.displayedBusinesses = this.getBusinessesForPage(page);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.displayedBusinesses = this.getBusinessesForPage(this.currentPage);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.displayedBusinesses = this.getBusinessesForPage(this.currentPage);
    }
  }

  deleteBusiness(idB: number) {
    if (confirm(
      'Are you sure you want to delete this business?')) {
      this.businessService.deleteBusiness({ idB }).subscribe({
        next: () => {
          this.businesses = this.businesses.filter(b => b.idBusiness !== idB);
          this.paginate();
        },
        error: (err) => console.error('Erreur de suppression', err)
      });
    }
  }

  getCategoryClass(category: string) {
    switch(category?.toUpperCase()) {
      case 'CUISINE': return 'bg-culinary text-culinary-dark';
      case 'BIJOUX': return 'bg-jewelry text-jewelry-dark';
      case 'MODE': return 'bg-fashion text-fashion-dark';
      case 'ARTISANAT': return 'bg-craft text-craft-dark';
      case 'BEAUTE': return 'bg-beauty text-beauty-dark';
      case 'DECORATION': return 'bg-decoration text-decoration-dark';
      case 'SERVICES': return 'bg-services text-services-dark';
      default: return 'bg-secondary text-dark';
    }
  }

  getCategoryStyle(category: string): string {
    return category ? category.toUpperCase() : 'non-classe';
  }

  openDetailsDialog(business: any) {
    this.dialog.open(BusinessDetailCardComponent, {
      width: '600px',
      data: business
    });
  }
}
