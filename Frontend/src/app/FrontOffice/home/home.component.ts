import { Component, AfterViewInit } from '@angular/core';



declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit {

  ngAfterViewInit(): void {
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
}
