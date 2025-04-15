import { Component, AfterViewInit, Input } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private businessService: GestionDesBusinessService, private router: Router) {}

  ngOnInit(): void {
    this.loadBusinesses();
  }

  ngAfterViewInit(): void {
    this.initializeSelect2();
    this.initializeParallax();
    setTimeout(() => {
      $('.wrap-slick1 .slick1').slick({
        pauseOnFocus: false,
        pauseOnHover: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        speed: 1000,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 6000,
        arrows: true,
        appendArrows: $('.wrap-slick1'),
        prevArrow: '<button class="arrow-slick1 prev-slick1"><i class="zmdi zmdi-caret-left"></i></button>',
        nextArrow: '<button class="arrow-slick1 next-slick1"><i class="zmdi zmdi-caret-right"></i></button>',
        dots: true,
        appendDots: $('.wrap-slick1').find('.wrap-slick1-dots'),
        dotsClass: 'slick1-dots',
      });

      const firstSlide = $('.wrap-slick1 .item-slick1').first().find('.layer-slick1');
      firstSlide.each(function (_index: number, element: HTMLElement) {
        const $this = $(element);
        setTimeout(() => {
          $this.addClass($this.data('appear') + ' visible-true');
        }, $this.data('delay'));
      });

      $('.wrap-slick1 .slick1').on('afterChange', function (_event: any, _slick: any, currentSlide: number) {
        const layerSlick1 = $('.wrap-slick1 .layer-slick1');
        layerSlick1.removeClass((_: number, className: string) => {
          const matches = className.match(/(?:^|\s)(fadeIn|fadeInDown|fadeInUp|zoomIn|rollIn|slideInUp|rotateIn.*?)(?=\s|$)/g);
          return (matches || []).join(' ') + ' visible-true';
        });

        const current = $('.wrap-slick1 .item-slick1').eq(currentSlide).find('.layer-slick1');
        current.each(function (_i: number, el: HTMLElement) {
          const $el = $(el);
          setTimeout(() => {
            $el.addClass($el.data('appear') + ' visible-true');
          }, $el.data('delay'));
        });
      });
    }, 100);
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

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  searchBusinesses(): void {
    this.applyFilters();
  }

  sortBusinesses(sortOption: string): void {
    this.sortBy = sortOption;
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

  getLogoUrl(logo: string): string {
    return logo ? `${this.baseUrl}${logo}` : 'assets/images/banner-07.jpg';
  }

  onImageError(event: Event, business: Business): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/banner-07.jpg';
    business.logo = ''; // Prevent repeated failed attempts
  }
}