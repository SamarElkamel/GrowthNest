import { Component, AfterViewInit, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnInit {
  posts: any[] = [];
  visiblePosts: any[] = [];
  itemsPerPage = 3;
  currentPage = 1;
  tags = ['FINANCE', 'MARKETING', 'JOBOFFER'];
  selectedTag = '';
  responsesMap: { [key: string]: any[] } = {};
  newResponse: { [key: string]: string } = {};
  showResponsesMap: { [key: string]: boolean } = {};
  likesMap: { [key: string]: number } = {};
  dislikesMap: { [key: string]: number } = {};
  private readonly API_BASE_URL = 'http://localhost:8080/Growthnest';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchPosts();
  }

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
      $('.wrap-slick1 .slick1').on('afterChange', function (_post: any, _slick: any, currentSlide: number) {
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

  fetchPosts(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InNhbGltIGhhZGRhcmkiLCJzdWIiOiJzYWxpbS5oYWRkYXJpQGVzcHJpdC50biIsImlhdCI6MTc0NDU3MjYyMCwiZXhwIjoxNzQ0NTgxMjYwLCJhdXRob3JpdGllcyI6WyJST0xFX1VTRVIiXX0.5ET0XYRxl_LBAaK7i4ULGRYYXjzfdl_JW8Og-O2JKNxHwsSv9TXbmc5L_AJhgL7i`);
  
    const url = this.selectedTag
      ? `http://localhost:8080/Growthnest/post/byTag/${this.selectedTag}`
      : 'http://localhost:8080/Growthnest/post/retrieveAllPost';
  
    this.http.get<any[]>(url, { headers }).subscribe({
      next: data => {
        this.posts = data;
        this.visiblePosts = [];
        this.currentPage = 1;
        this.loadMore();

        // Load responses and reactions for all posts
        this.posts.forEach(post => {
          this.loadResponses(post.idp);
          this.fetchLikes(post.idp);
          this.fetchDislikes(post.idp);
        });
      },
      error: err => console.error('Error fetching posts', err)
    });
  }

  loadResponses(postId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InNhbGltIGhhZGRhcmkiLCJzdWIiOiJzYWxpbS5oYWRkYXJpQGVzcHJpdC50biIsImlhdCI6MTc0NDU3MjYyMCwiZXhwIjoxNzQ0NTgxMjYwLCJhdXRob3JpdGllcyI6WyJST0xFX1VTRVIiXX0.5ET0XYRxl_LBAaK7i4ULGRYYXjzfdl_JW8Og-O2JKNxHwsSv9TXbmc5L_AJhgL7i`);
    
    this.http.get<any[]>(`http://localhost:8080/Growthnest/respons/byPost/${postId}`, { headers })
      .subscribe({
        next: data => {
          this.responsesMap[postId] = data;
        },
        error: err => {
          console.error(`Error loading responses for ${postId}:`, err);
          this.responsesMap[postId] = [];
        }
      });
  }

  submitResponse(postId: number) {
    const respons = this.newResponse[postId];
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InNhbGltIGhhZGRhcmkiLCJzdWIiOiJzYWxpbS5oYWRkYXJpQGVzcHJpdC50biIsImlhdCI6MTc0NDU3MjYyMCwiZXhwIjoxNzQ0NTgxMjYwLCJhdXRob3JpdGllcyI6WyJST0xFX1VTRVIiXX0.5ET0XYRxl_LBAaK7i4ULGRYYXjzfdl_JW8Og-O2JKNxHwsSv9TXbmc5L_AJhgL7i`);

    this.http.post('http://localhost:8080/Growthnest/respons/addRespons', {
      respons,
      postId
    }, { headers })
      .subscribe({
        next: (newRespons) => {
          // Reset textarea
          this.newResponse[postId] = '';

          // Add new response directly to existing array
          if (!this.responsesMap[postId]) {
            this.responsesMap[postId] = [];
          }
          this.responsesMap[postId].push(newRespons);
        },
        error: err => {
          console.error('Error adding response:', err);
        }
      });
  }

  loadMore(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = this.currentPage * this.itemsPerPage;
    const nextItems = this.posts.slice(start, end);
    this.visiblePosts = [...this.visiblePosts, ...nextItems];
  
    // Load responses and reactions for each new post
    nextItems.forEach(post => {
      this.loadResponses(post.idp);
      this.fetchLikes(post.idp);
      this.fetchDislikes(post.idp);
    });
  
    this.currentPage++;
  }

  fetchLikes(postId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InNhbGltIGhhZGRhcmkiLCJzdWIiOiJzYWxpbS5oYWRkYXJpQGVzcHJpdC50biIsImlhdCI6MTc0NDU3MjYyMCwiZXhwIjoxNzQ0NTgxMjYwLCJhdXRob3JpdGllcyI6WyJST0xFX1VTRVIiXX0.5ET0XYRxl_LBAaK7i4ULGRYYXjzfdl_JW8Og-O2JKNxHwsSv9TXbmc5L_AJhgL7i`);

    this.http.get<number>(`http://localhost:8080/Growthnest/post/likes/${postId}`, { headers })
      .subscribe({
        next: count => {
          this.likesMap[postId] = count;
        },
        error: err => {
          console.error('Error fetching likes:', err);
          this.likesMap[postId] = 0;
        }
      });
  }

  fetchDislikes(postId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InNhbGltIGhhZGRhcmkiLCJzdWIiOiJzYWxpbS5oYWRkYXJpQGVzcHJpdC50biIsImlhdCI6MTc0NDU3MjYyMCwiZXhwIjoxNzQ0NTgxMjYwLCJhdXRob3JpdGllcyI6WyJST0xFX1VTRVIiXX0.5ET0XYRxl_LBAaK7i4ULGRYYXjzfdl_JW8Og-O2JKNxHwsSv9TXbmc5L_AJhgL7i`);

    this.http.get<number>(`http://localhost:8080/Growthnest/post/dislikes/${postId}`, { headers })
      .subscribe({
        next: count => {
          this.dislikesMap[postId] = count;
        },
        error: err => {
          console.error('Error fetching dislikes:', err);
          this.dislikesMap[postId] = 0;
        }
      });
  }

  onTagChange(): void {
    this.fetchPosts(); // refetch posts based on tag
  }

  toggleResponses(postId: number) {
    this.showResponsesMap[postId] = !this.showResponsesMap[postId];
  }

  addReact(postId: number, type: 'LIKE' | 'DISLIKE') {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InNhbGltIGhhZGRhcmkiLCJzdWIiOiJzYWxpbS5oYWRkYXJpQGVzcHJpdC50biIsImlhdCI6MTc0NDU3MjYyMCwiZXhwIjoxNzQ0NTgxMjYwLCJhdXRob3JpdGllcyI6WyJST0xFX1VTRVIiXX0.5ET0XYRxl_LBAaK7i4ULGRYYXjzfdl_JW8Og-O2JKNxHwsSv9TXbmc5L_AJhgL7i`);

    const request = {
      idp: postId,
      type: type
    };

    this.http.post('http://localhost:8080/Growthnest/api/reacts/add', request, { headers })
      .subscribe({
        next: () => {
          // Refresh both likes and dislikes counts after adding reaction
          this.fetchLikes(postId);
          this.fetchDislikes(postId);
        },
        error: err => console.error('Error adding reaction:', err)
      });
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none';
  }

  getMediaUrl(path: string): string {
    if (!path) return '';
    return `${this.API_BASE_URL}${path}`;
  }
}
