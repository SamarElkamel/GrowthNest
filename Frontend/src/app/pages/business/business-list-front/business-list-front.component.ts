import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Business } from 'src/app/services/models';
import { GestionDesBusinessService } from 'src/app/services/services';

declare var $: any;
declare var swal: any;
@Component({
  selector: 'app-business-list-front',
  templateUrl: './business-list-front.component.html',
  styleUrls: ['./business-list-front.component.scss']
})


export class BusinessListFrontComponent {
  
   businesses: Business[] = [];
   @Input() business: any;
 

  
    constructor(private businessService: GestionDesBusinessService,private router: Router) { }
  
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
         /* customPaging: function (slick: any, index: number): string {
            const linkThumb = $(slick.$slides[index]).data('thumb');
            const caption = $(slick.$slides[index]).data('caption');
            return `<img src="${linkThumb}"><span class="caption-dots-slick1">${caption}</span>`;
          }*/
        });
  
        // Animate first slide manually
        const firstSlide = $('.wrap-slick1 .item-slick1').first().find('.layer-slick1');
        firstSlide.each(function (_index: number, element: HTMLElement) {
          const $this = $(element);
          setTimeout(() => {
            $this.addClass($this.data('appear') + ' visible-true');
          }, $this.data('delay'));
        });
  
        // Animate on slide change
        $('.wrap-slick1 .slick1').on('afterChange', function (_event: any, _slick: any, currentSlide: number) {
          const layerSlick1 = $('.wrap-slick1 .layer-slick1');
  
          // Remove previous animation classes
          layerSlick1.removeClass((_: number, className: string) => {
            const matches = className.match(/(?:^|\s)(fadeIn|fadeInDown|fadeInUp|zoomIn|rollIn|slideInUp|rotateIn.*?)(?=\s|$)/g);
            return (matches || []).join(' ') + ' visible-true';
          });
  
          // Animate new slide layers
          const current = $('.wrap-slick1 .item-slick1').eq(currentSlide).find('.layer-slick1');
          current.each(function (_i: number, el: HTMLElement) {
            const $el = $(el);
            setTimeout(() => {
              $el.addClass($el.data('appear') + ' visible-true');
            }, $el.data('delay'));
          });
        });
      }, 100); // Wait for Angular to render the view
    }
  
   /* async loadBusinesses() {
      try {
        const response$ = this.businessService.getAllBusiness();
        this.businesses = await lastValueFrom(response$);
      } catch (error) {
        console.error('Error loading businesses', error);
      }
    }*/
      loadBusinesses() {
        this.businessService.getAllBusiness().subscribe({
          next: (businesses) => this.businesses = businesses,
          error: (err) => console.error('Error:', err)
        });
      }
      
    
      private initializeSelect2(): void {
        $('.js-select2').each(function(this: HTMLElement) { // <-- Ajouter le type ici
          $(this).select2({
            minimumResultsForSearch: 20,
            dropdownParent: $(this).next('.dropDownSelect2')
          });
        });
      }
    
      private initializeParallax(): void {
        $('.parallax100').parallax100();
      }
      onBusinessClick(businessId: number): void {
        this.router.navigate(['/business', businessId, 'products']);
      }
      viewProducts(businessId: number): void {
        if (businessId) {
          this.router.navigate(['/business', businessId, 'products']);
        } else {
          console.error('ID Business non trouvé dans l\'objet:', this.business);
        }
      } 

}
