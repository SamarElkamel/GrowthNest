import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

type ReactionType = 'LIKE' | 'LOVE' | 'HAHA' | 'WOW' | 'SAD' | 'ANGRY';

@Component({
  selector: 'app-list-post',
  templateUrl: './list-post.component.html',
  styleUrls: ['./list-post.component.scss']
})
export class ListPostComponent implements OnInit {

  posts: any[] = [];
  visiblePosts: any[] = [];
  itemsPerPage = 3;
  currentPage = 1;
  tags = ['FINANCE', 'MARKETING', 'JOBOFFER'];
  selectedTag = '';
  isDropdownOpen = false;
  selectedTagDisplay = 'Filter';
  activeFilter = 'All';
  showAddPostModal = false;
  newPost = { title: '', content: '', tags: '' };
  selectedImage?: File;
  selectedVideo?: File;

  responsesMap: { [key: string]: any[] } = {};
  newResponse: { [key: string]: string } = {};
  showResponsesMap: { [key: string]: boolean } = {};

  likesMap: { [key: string]: number } = {};
  dislikesMap: { [key: string]: number } = {};
  savedMap: { [key: number]: boolean } = {};

  reactionCountsMap: { [responseId: number]: { [type in ReactionType]?: number } } = {};
  reactionEmojis: { [key in ReactionType]: string } = {
    LIKE: '👍',
    LOVE: '❤️',
    HAHA: '😂',
    WOW: '😲',
    SAD: '😢',
    ANGRY: '😡'
  };

  readonly reactionTypes: ReactionType[] = ['LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY'];

  private readonly API_BASE_URL = 'http://localhost:8080/Growthnest';

  constructor(private http: HttpClient) {}

  badWords = ['shit', 'fuck', 'bitch', 'damn', 'ass', 'kill'];

  containsBadWords(text: string): boolean {
    return this.badWords.some(word => text.toLowerCase().includes(word));
  }

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ1ODQ2MjQzLCJleHAiOjE3NDU4NTQ4ODMsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.PikIF9jiPVPEIL6LKY8qhM2RvmMxC33qv1URMKmqzOpFwzYfcZJsnvMeSoaq6kpt`);
    const url = this.selectedTag ? `${this.API_BASE_URL}/post/byTag/${this.selectedTag}` : `${this.API_BASE_URL}/post/retrieveAllPost`;

    this.http.get<any[]>(url, { headers }).subscribe({
      next: data => {
        this.posts = data;
        this.loadSavedPosts();
        this.visiblePosts = [];
        this.currentPage = 1;
        this.loadMore();
      },
      error: err => console.error('Error fetching posts', err)
    });
  }

  loadMore() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = this.currentPage * this.itemsPerPage;
    const nextItems = this.posts.slice(start, end);
    this.visiblePosts = [...this.visiblePosts, ...nextItems];
    this.currentPage++;

    nextItems.forEach(post => {
      this.loadResponses(post.idp);
      this.fetchLikes(post.idp);
      this.fetchDislikes(post.idp);
    });
  }

  fetchLikes(postId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ1ODQ2MjQzLCJleHAiOjE3NDU4NTQ4ODMsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.PikIF9jiPVPEIL6LKY8qhM2RvmMxC33qv1URMKmqzOpFwzYfcZJsnvMeSoaq6kpt`);
    this.http.get<number>(`${this.API_BASE_URL}/post/likes/${postId}`, { headers }).subscribe({
      next: count => { this.likesMap[postId] = count || 0; },
      error: err => console.error('Error fetching likes', err)
    });
  }

  fetchDislikes(postId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ1ODQ2MjQzLCJleHAiOjE3NDU4NTQ4ODMsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.PikIF9jiPVPEIL6LKY8qhM2RvmMxC33qv1URMKmqzOpFwzYfcZJsnvMeSoaq6kpt`);
    this.http.get<number>(`${this.API_BASE_URL}/post/dislikes/${postId}`, { headers }).subscribe({
      next: count => { this.dislikesMap[postId] = count || 0; },
      error: err => console.error('Error fetching dislikes', err)
    });
  }

  addReact(postId: number, type: 'LIKE' | 'DISLIKE') {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ1ODQ2MjQzLCJleHAiOjE3NDU4NTQ4ODMsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.PikIF9jiPVPEIL6LKY8qhM2RvmMxC33qv1URMKmqzOpFwzYfcZJsnvMeSoaq6kpt`);
    const request = { idp: postId, type };

    this.http.post(`${this.API_BASE_URL}/api/reacts/add`, request, { headers }).subscribe({
      next: () => {
        this.fetchLikes(postId);
        this.fetchDislikes(postId);
      },
      error: err => console.error('Error reacting to post:', err)
    });
  }

  addReactToResponse(responseId: number, type: ReactionType) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ1ODQ2MjQzLCJleHAiOjE3NDU4NTQ4ODMsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.PikIF9jiPVPEIL6LKY8qhM2RvmMxC33qv1URMKmqzOpFwzYfcZJsnvMeSoaq6kpt`);
    const request = { responsId: responseId, type };

    this.http.post(`${this.API_BASE_URL}/api/react-responses/add`, request, { headers }).subscribe({
      next: () => {
        this.loadReactionCounts(responseId);
      },
      error: err => console.error('Error reacting to response:', err)
    });
  }

  loadResponses(postId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ1ODQ2MjQzLCJleHAiOjE3NDU4NTQ4ODMsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.PikIF9jiPVPEIL6LKY8qhM2RvmMxC33qv1URMKmqzOpFwzYfcZJsnvMeSoaq6kpt`);
    this.http.get<any[]>(`${this.API_BASE_URL}/respons/byPost/${postId}`, { headers }).subscribe({
      next: data => {
        this.responsesMap[postId] = data;
        data.forEach(response => {
          if (!response.user && response.userId) {
            this.loadUserForResponse(response);
          }
          this.loadReactionCounts(response.id);
        });
      },
      error: err => console.error('Error loading responses:', err)
    });
  }

  loadUserForResponse(response: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ1ODQ2MjQzLCJleHAiOjE3NDU4NTQ4ODMsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.PikIF9jiPVPEIL6LKY8qhM2RvmMxC33qv1URMKmqzOpFwzYfcZJsnvMeSoaq6kpt`);
    this.http.get<any>(`${this.API_BASE_URL}/user/${response.userId}`, { headers }).subscribe({
      next: user => {
        response.user = user;
      },
      error: err => console.error('Error loading user info:', err)
    });
  }

  loadReactionCounts(responseId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ1ODQ2MjQzLCJleHAiOjE3NDU4NTQ4ODMsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.PikIF9jiPVPEIL6LKY8qhM2RvmMxC33qv1URMKmqzOpFwzYfcZJsnvMeSoaq6kpt`);
    this.http.get<any[]>(`${this.API_BASE_URL}/api/react-responses/respons/${responseId}`, { headers }).subscribe({
      next: reactions => {
        this.reactionCountsMap[responseId] = {};
        for (const react of reactions) {
          const type = react.type as ReactionType;
          if (!this.reactionCountsMap[responseId][type]) {
            this.reactionCountsMap[responseId][type] = 0;
          }
          this.reactionCountsMap[responseId][type]!++;
        }
      },
      error: err => console.error('Error loading reaction counts:', err)
    });
  }

  toggleResponses(postId: number) {
    this.showResponsesMap[postId] = !this.showResponsesMap[postId];
  }

  submitResponse(postId: number) {
    const respons = this.newResponse[postId];
    if (!respons) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ1ODQ2MjQzLCJleHAiOjE3NDU4NTQ4ODMsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.PikIF9jiPVPEIL6LKY8qhM2RvmMxC33qv1URMKmqzOpFwzYfcZJsnvMeSoaq6kpt`);

    this.http.post(`${this.API_BASE_URL}/respons/addRespons`, { respons, postId }, { headers }).subscribe({
      next: (newResp: any) => {
        if (!this.responsesMap[postId]) this.responsesMap[postId] = [];
        this.responsesMap[postId].push(newResp);
        this.newResponse[postId] = '';
      },
      error: err => console.error('Error adding response:', err)
    });
  }

  toggleSave(postId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ1ODQ2MjQzLCJleHAiOjE3NDU4NTQ4ODMsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.PikIF9jiPVPEIL6LKY8qhM2RvmMxC33qv1URMKmqzOpFwzYfcZJsnvMeSoaq6kpt`);
    this.http.post(`${this.API_BASE_URL}/post/save/${postId}`, {}, { headers }).subscribe({
      next: () => { this.savedMap[postId] = !this.savedMap[postId]; },
      error: err => console.error('Error saving post:', err)
    });
  }

  getMediaUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${this.API_BASE_URL}/${path}`;
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  getTotalPages(): number {
    return Math.ceil(this.posts.length / this.itemsPerPage);
  }

  getTotalPagesArray(): number[] {
    return Array(this.getTotalPages()).fill(0).map((_, i) => i + 1);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.getTotalPages()) return;
    this.currentPage = page;
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = this.currentPage * this.itemsPerPage;
    this.visiblePosts = this.posts.slice(start, end);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectTag(tag: string) {
    this.selectedTag = tag;
    this.selectedTagDisplay = tag || 'Filter';
    this.isDropdownOpen = false;
    this.fetchPosts();
  }

  loadSavedPosts() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ1ODQ2MjQzLCJleHAiOjE3NDU4NTQ4ODMsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.PikIF9jiPVPEIL6LKY8qhM2RvmMxC33qv1URMKmqzOpFwzYfcZJsnvMeSoaq6kpt`);
    this.http.get<number[]>(`${this.API_BASE_URL}/post/saved`, { headers }).subscribe({
      next: (savedIds: number[]) => {
        this.savedMap = {};
        savedIds.forEach(id => this.savedMap[id] = true);
      },
      error: err => console.error('Error loading saved posts:', err)
    });
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

  fetchMyPosts() {
    this.activeFilter = 'MyPosts';
    const currentUserId = localStorage.getItem('userId');
    this.visiblePosts = this.posts.filter(p => p.user?.id === Number(currentUserId));
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
    const headers = new HttpHeaders({ Authorization: `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ1ODQ2MjQzLCJleHAiOjE3NDU4NTQ4ODMsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.PikIF9jiPVPEIL6LKY8qhM2RvmMxC33qv1URMKmqzOpFwzYfcZJsnvMeSoaq6kpt` });

    this.http.post(`${this.API_BASE_URL}/post/addPost`, formData, { headers }).subscribe({
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
}
