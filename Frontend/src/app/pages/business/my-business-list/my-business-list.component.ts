import { Component, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Business } from 'src/app/services/models/business';
import { GestionDesBusinessService } from 'src/app/services/services';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-my-business-list',
  templateUrl: './my-business-list.component.html',
  styleUrls: ['./my-business-list.component.scss']
})
export class MyBusinessListComponent implements OnInit {
  businesses: Business[] = [];
  filteredBusinesses: Business[] = [];
  paginatedBusinesses: Business[] = [];
  loading: boolean = true;
  error: string | null = null;
  baseUrl: string = 'http://localhost:8080/Growthnest';


  // Pagination properties
  pageSize = 6;
  pageIndex = 0;
  pageSizeOptions = [3, 6, 9, 12];

  // Filter properties
  selectedCategory: string = '';
  categories: string[] = ['FOOD', 'TECH', 'FASHION', 'GENERAL']; // Ajustez selon vos catégories
  showFilter: boolean = false;
  showSearch: boolean = false;
  searchQuery: string = '';
  sortBy: string = 'default';

  constructor(
    private businessService: GestionDesBusinessService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.loadMyBusinesses();
  }

  loadMyBusinesses(): void {
    this.loading = true;
    this.businessService.getMyBusinesses().subscribe({
      next: (data) => {
        this.businesses = data;
        this.filteredBusinesses = [...data];
        this.applyFiltersAndSort();
        this.updatePaginatedBusinesses();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement de vos entreprises.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  getLogoUrl(logo: string | null | undefined): string {
    return logo ? `${this.baseUrl}/uploads/logos/${logo.split('/').pop()}` : 'assets/images/banner-07.jpg';
  }

  onImageError(event: Event, business: Business): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/banner-07.jpg';
    business.logo = '';
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFiltersAndSort();
    this.updatePaginatedBusinesses();
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
  }

  searchBusinesses(): void {
    this.applyFiltersAndSort();
    this.updatePaginatedBusinesses();
  }

  sortBusinesses(event: Event, sortBy: string): void {
    event.preventDefault();
    this.sortBy = sortBy;
    this.applyFiltersAndSort();
    this.updatePaginatedBusinesses();
  }

  applyFiltersAndSort(): void {
    let filtered = [...this.businesses];

    // Filtrer par catégorie
    if (this.selectedCategory) {
      filtered = filtered.filter(b => b.categorieBusiness === this.selectedCategory);
    }

    // Filtrer par recherche
    if (this.searchQuery) {
      filtered = filtered.filter(b =>
        b.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    // Trier
    if (this.sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    this.filteredBusinesses = filtered;
  }

  updatePaginatedBusinesses(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedBusinesses = this.filteredBusinesses.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedBusinesses();
  }
}