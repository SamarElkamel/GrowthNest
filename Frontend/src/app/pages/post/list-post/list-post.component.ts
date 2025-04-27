import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface ReactRequest {
  idp: number;
  type: 'LIKE' | 'DISLIKE';
}

interface React {
  id: number;
  type: 'LIKE' | 'DISLIKE';
  user: { id: number; fullName: string };
  post: { id: number };
}

@Component({
  selector: 'app-list-post',
  templateUrl: './list-post.component.html',
  styleUrls: ['./list-post.component.scss']
})
export class ListPostComponent implements OnInit {
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

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
  reactionsMap: { [key: string]: React[] } = {};
  savedMap: { [key: number]: boolean } = {};
  imageLoadingStates: { [key: string]: boolean } = {};
  showAddPostModal = false;
  newPost = { title: '', content: '', tags: '' };
  selectedImage?: File;
  selectedVideo?: File;
  activeFilter: string = 'All';
  private readonly API_BASE_URL = 'http://localhost:8080/Growthnest';

  ngOnInit(): void {
    this.fetchPosts();
  }

  badWords = ['shit', 'fuck', 'bitch', 'damn', 'ass', 'kill'];

  containsBadWords(text: string): boolean {
    return this.badWords.some(word => text.toLowerCase().includes(word));
  }

  fetchPosts(): void {
    this.activeFilter = 'All';
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ1NzY2NzA4LCJleHAiOjE3NDU3NzUzNDgsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.4j3TztEYbiHWiSE7csevjdz6o-Y1HgxpM_8AG9iFsr2paW0civZ22ZZCsfrgiZbu`);
    const url = this.selectedTag ? `${this.API_BASE_URL}/post/byTag/${this.selectedTag}` : `${this.API_BASE_URL}/post/retrieveAllPost`;

    this.http.get<any[]>(url, { headers }).subscribe({
      next: data => {
        this.posts = data;
        this.loadSavedPosts();
        this.visiblePosts = [];
        this.currentPage = 1;
        this.loadMore();
        this.posts.forEach(post => {
          this.loadResponses(post.idp);
          this.fetchLikes(post.idp);
          this.fetchDislikes(post.idp);
        });
      },
      error: err => console.error('Error fetching posts', err)
    });
  }

  loadMore(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = this.currentPage * this.itemsPerPage;
    const nextItems = this.posts.slice(start, end);
    this.visiblePosts = [...this.visiblePosts, ...nextItems];
    nextItems.forEach(post => {
      this.loadResponses(post.idp);
      this.fetchLikes(post.idp);
      this.fetchDislikes(post.idp);
    });
    this.currentPage++;
  }

  filterSaved() {
    this.activeFilter = 'Saved';
    this.visiblePosts = this.posts.filter(p => this.savedMap[p.idp]);
  }

  filterTrending() {
    this.activeFilter = 'Trending';
    this.visiblePosts = this.posts.filter(p => (this.likesMap[p.idp] || 0) >= 2);
  }

  filterRecent() {
    this.activeFilter = 'Newest';
    this.visiblePosts = [...this.posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  filterMyPosts() {
    this.activeFilter = 'MyPosts';
    const currentUserId = localStorage.getItem('userId');
    this.visiblePosts = this.posts.filter(p => p.user?.id === Number(currentUserId));
  }

  onTagChange(): void {
    this.fetchPosts();
  }


  toggleResponses(postId: number) {
    this.showResponsesMap[postId] = !this.showResponsesMap[postId];
  }
  

  toggleSave(postId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ1NzY2NzA4LCJleHAiOjE3NDU3NzUzNDgsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.4j3TztEYbiHWiSE7csevjdz6o-Y1HgxpM_8AG9iFsr2paW0civZ22ZZCsfrgiZbu`);
    this.http.post(`${this.API_BASE_URL}/post/save/${postId}`, {}, { headers })
      .subscribe({
        next: () => { this.savedMap[postId] = !this.savedMap[postId]; },
        error: err => console.error('Error saving post:', err)
      });
  }

  addReact(postId: number, type: 'LIKE' | 'DISLIKE') {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ1NzY2NzA4LCJleHAiOjE3NDU3NzUzNDgsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.4j3TztEYbiHWiSE7csevjdz6o-Y1HgxpM_8AG9iFsr2paW0civZ22ZZCsfrgiZbu`);
    const request: ReactRequest = { idp: postId, type };

    this.http.post<React | null>(`${this.API_BASE_URL}/api/reacts/add`, request, { headers })
      .subscribe({
        next: () => {
          this.fetchLikes(postId);
          this.fetchDislikes(postId);
        },
        error: err => console.error('Error adding reaction:', err)
      });
  }

  submitResponse(postId: number) {
    const respons = this.newResponse[postId];
    if (!respons) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ1NzY2NzA4LCJleHAiOjE3NDU3NzUzNDgsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.4j3TztEYbiHWiSE7csevjdz6o-Y1HgxpM_8AG9iFsr2paW0civZ22ZZCsfrgiZbu`);

    this.http.post(`${this.API_BASE_URL}/respons/addRespons`, { respons, postId }, { headers })
      .subscribe({
        next: (newResp: any) => {
          if (!this.responsesMap[postId]) this.responsesMap[postId] = [];
          this.responsesMap[postId].push(newResp);
          this.newResponse[postId] = '';
        },
        error: err => console.error('Error adding response:', err)
      });
  }

  onFileSelected(event: any, type: 'image' | 'video') {
    const file = event.target.files[0];
    if (type === 'image') this.selectedImage = file;
    if (type === 'video') this.selectedVideo = file;
  }

  submitNewPost() {
    if (this.containsBadWords(this.newPost.title) || this.containsBadWords(this.newPost.content)) {
      alert('🚫 Your post contains inappropriate language.');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.newPost.title);
    formData.append('content', this.newPost.content);
    formData.append('tags', this.newPost.tags);
    if (this.selectedImage) formData.append('image', this.selectedImage);
    if (this.selectedVideo) formData.append('video', this.selectedVideo);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ1NzY2NzA4LCJleHAiOjE3NDU3NzUzNDgsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.4j3TztEYbiHWiSE7csevjdz6o-Y1HgxpM_8AG9iFsr2paW0civZ22ZZCsfrgiZbu` });

    this.http.post(`${this.API_BASE_URL}/post/addPost`, formData, { headers })
      .subscribe({
        next: () => {
          alert('Post added successfully!');
          this.showAddPostModal = false;
          this.newPost = { title: '', content: '', tags: '' };
          this.selectedImage = undefined;
          this.selectedVideo = undefined;
          this.fetchPosts();
        },
        error: err => alert('Error adding post: ' + err.message)
      });
  }

  getMediaUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${this.API_BASE_URL}/${path}`;
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none';
  }

  getTotalPages(): number {
    return Math.ceil(this.posts.length / this.itemsPerPage);
  }

  getTotalPagesArray(): number[] {
    return Array(this.getTotalPages()).fill(0);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.getTotalPages()) return;
    this.currentPage = page;
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = this.currentPage * this.itemsPerPage;
    this.visiblePosts = this.posts.slice(start, end);
  }

  loadSavedPosts() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ1NzY2NzA4LCJleHAiOjE3NDU3NzUzNDgsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.4j3TztEYbiHWiSE7csevjdz6o-Y1HgxpM_8AG9iFsr2paW0civZ22ZZCsfrgiZbu`);
    this.http.get<number[]>(`${this.API_BASE_URL}/post/saved`, { headers })
      .subscribe({
        next: (savedIds: number[]) => {
          this.savedMap = {};
          savedIds.forEach(id => this.savedMap[id] = true);
        },
        error: err => console.error('Error loading saved posts:', err)
      });
  }

  loadResponses(postId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ1NzY2NzA4LCJleHAiOjE3NDU3NzUzNDgsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.4j3TztEYbiHWiSE7csevjdz6o-Y1HgxpM_8AG9iFsr2paW0civZ22ZZCsfrgiZbu`);
    this.http.get<any[]>(`${this.API_BASE_URL}/respons/byPost/${postId}`, { headers })
      .subscribe({
        next: data => { this.responsesMap[postId] = data; },
        error: err => { this.responsesMap[postId] = []; console.error('Error loading responses:', err); }
      });
  }

  fetchLikes(postId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ1NzY2NzA4LCJleHAiOjE3NDU3NzUzNDgsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.4j3TztEYbiHWiSE7csevjdz6o-Y1HgxpM_8AG9iFsr2paW0civZ22ZZCsfrgiZbu`);
    this.http.get<number>(`${this.API_BASE_URL}/post/likes/${postId}`, { headers })
      .subscribe({
        next: count => { this.likesMap[postId] = count || 0; },
        error: err => { this.likesMap[postId] = 0; console.error('Error fetching likes:', err); }
      });
  }

  fetchDislikes(postId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ1NzY2NzA4LCJleHAiOjE3NDU3NzUzNDgsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.4j3TztEYbiHWiSE7csevjdz6o-Y1HgxpM_8AG9iFsr2paW0civZ22ZZCsfrgiZbu`);
    this.http.get<number>(`${this.API_BASE_URL}/post/dislikes/${postId}`, { headers })
      .subscribe({
        next: count => { this.dislikesMap[postId] = count || 0; },
        error: err => { this.dislikesMap[postId] = 0; console.error('Error fetching dislikes:', err); }
      });
  }

  fetchMyPosts() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ1NzY2NzA4LCJleHAiOjE3NDU3NzUzNDgsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.4j3TztEYbiHWiSE7csevjdz6o-Y1HgxpM_8AG9iFsr2paW0civZ22ZZCsfrgiZbu`);
    this.http.get<any[]>(`${this.API_BASE_URL}/post/myPosts`, { headers })
      .subscribe({
        next: data => {
          this.posts = data;
          this.visiblePosts = [];
          this.currentPage = 1;
          this.loadMore();
          this.posts.forEach(post => {
            this.loadResponses(post.idp);
            this.fetchLikes(post.idp);
            this.fetchDislikes(post.idp);
          });
        },
        error: err => console.error('Error fetching user posts:', err)
      });
  }

  isDropdownOpen = false;
selectedTagDisplay = 'Filter';

toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
}

selectTag(tag: string) {
  this.selectedTag = tag;
  this.selectedTagDisplay = tag || 'Filter';
  this.isDropdownOpen = false;
  this.onTagChange();
}
}
