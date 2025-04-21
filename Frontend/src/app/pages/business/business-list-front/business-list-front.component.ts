import { Component, AfterViewInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { Business, CategorieBusiness } from 'src/app/services/models';
import { GestionDesBusinessService } from 'src/app/services/services';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-business-list-front',
  templateUrl: './business-list-front.component.html',
  styleUrls: ['./business-list-front.component.scss'],
})
export class BusinessListFrontComponent implements AfterViewInit {
  businesses: Business[] = [];
  filteredBusinesses: Business[] = [];
  paginatedBusinesses: Business[] = [];
  topThreeBusinesses: Business[] = []; // Nouvelle propriété pour les trois meilleures entreprises
  categories: string[] = Object.values(CategorieBusiness);
  selectedCategory: string = '';
  searchQuery: string = '';
  sortBy: string = 'default';
  showFilter: boolean = false;
  showSearch: boolean = false;
  loading: boolean = true;
  error: string | null = null;
  @Input() business?: Business;
  baseUrl: string = 'http://localhost:8080/Growthnest';

  pageSize = 6;
  pageIndex = 0;
  pageSizeOptions: number[] = [6, 12, 24];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private businessService: GestionDesBusinessService, private router: Router) {}

  ngOnInit(): void {
    this.loadBusinesses();
    this.loadTopThreeBusinesses(); // Charger les trois meilleures entreprises
  }

  ngAfterViewInit(): void {
    this.initializeSelect2();
    this.initializeParallax();
  }

  loadBusinesses(): void {
    this.loading = true;
    this.businessService.getAllBusiness().subscribe({
      next: (data) => {
        this.businesses = data;
        this.filteredBusinesses = [...this.businesses];
        this.loading = false;
        this.applyFilters();
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des entreprises.';
        this.loading = false;
        console.error(err);
      },
    });
  }

  loadTopThreeBusinesses(): void {
    this.businessService.getTopThreeBusinesses().subscribe({
      next: (data) => {
        this.topThreeBusinesses = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des meilleures entreprises:', err);
        this.topThreeBusinesses = [];
      },
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.pageIndex = 0;
    this.applyFilters();
  }

  searchBusinesses(): void {
    this.pageIndex = 0;
    this.applyFilters();
  }

  sortBusinesses(event: MouseEvent, sortOption: string): void {
    event.preventDefault();
    this.sortBy = sortOption;
    this.pageIndex = 0;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.businesses];

    if (this.selectedCategory) {
      result = result.filter((business) => business.categorieBusiness === this.selectedCategory);
    }

    if (this.searchQuery) {
      result = result.filter((business) => business.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
    }

    switch (this.sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      default:
        break;
    }

    this.filteredBusinesses = result;
    this.updatePaginatedBusinesses();
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedBusinesses();
  }

  updatePaginatedBusinesses(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedBusinesses = this.filteredBusinesses.slice(startIndex, endIndex);
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

  private initializeSelect2(): void {
    $('.js-select2').each(function (this: HTMLElement) {
      $(this).select2({
        minimumResultsForSearch: 20,
        dropdownParent: $(this).next('.dropDownSelect2'),
      });
    });
  }

  private initializeParallax(): void {
    $('.parallax100').parallax100();
  }

  onBusinessClick(businessId: number): void {
    this.router.navigate(['/business', businessId, 'products']);
  }

  getLogoUrl(logo: string | null | undefined): string {
    return logo ? `${this.baseUrl}/uploads/logos/${logo.split('/').pop()}` : 'assets/images/banner-07.jpg';
  }

  onImageError(event: Event, business: Business): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/banner-07.jpg';
    business.logo = '';
  }
}