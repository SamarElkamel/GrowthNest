import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface ReactRequest {
  idp: number;
  type: 'LIKE' | 'DISLIKE';
}

interface React {
  id: number;
  type: 'LIKE' | 'DISLIKE';
  user: {
    id: number;
    fullName: string;
  };
  post: {
    id: number;
  };
}

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
  responsesMap: { [key: string]: any[] } = {};
  newResponse: { [key: string]: string } = {};
  showResponsesMap: { [key: string]: boolean } = {};
  likesMap: { [key: string]: number } = {};
  dislikesMap: { [key: string]: number } = {};
  reactionsMap: { [key: string]: React[] } = {};
  showEditFormMap: { [key: string]: boolean } = {};
  editedPost: { [key: string]: any } = {};
  editedResponse: { [key: string]: string } = {};
  showEditResponseMap: { [key: string]: boolean } = {};
  savedMap: { [key: number]: boolean } = {};
  private readonly API_BASE_URL = 'http://localhost:8080/Growthnest';
  imageLoadingStates: { [key: string]: boolean } = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchPosts();
  }
  badWords = ['shit', 'fuck', 'bitch', 'damn', 'ass'];
  containsBadWords(text: string): boolean {
    const lowered = text.toLowerCase();
    return this.badWords.some(word => lowered.includes(word));
  }

  fetchPosts(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ0NzU1NDM1LCJleHAiOjE3NDQ3NjQwNzUsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.2nou13BAMlrk0VpDebJGHpfikdR0gk4f8IK2MOw1ymjSaweCeFCR4nZYtxp1WVzK`);
  
    const url = this.selectedTag
      ? `http://localhost:8080/Growthnest/post/byTag/${this.selectedTag}`
      : 'http://localhost:8080/Growthnest/post/retrieveAllPost';
  
    this.http.get<any[]>(url, { headers }).subscribe({
      next: data => {
        this.posts = data;
        this.loadSavedPosts();
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
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ0NzU1NDM1LCJleHAiOjE3NDQ3NjQwNzUsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.2nou13BAMlrk0VpDebJGHpfikdR0gk4f8IK2MOw1ymjSaweCeFCR4nZYtxp1WVzK`);
    
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
  const headers = new HttpHeaders().set(
    'Authorization',
      `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ0NzU1NDM1LCJleHAiOjE3NDQ3NjQwNzUsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.2nou13BAMlrk0VpDebJGHpfikdR0gk4f8IK2MOw1ymjSaweCeFCR4nZYtxp1WVzK`
  );

  this.http
    .post('http://localhost:8080/Growthnest/respons/addRespons', {
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
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ0NzU1NDM1LCJleHAiOjE3NDQ3NjQwNzUsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.2nou13BAMlrk0VpDebJGHpfikdR0gk4f8IK2MOw1ymjSaweCeFCR4nZYtxp1WVzK`);

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
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ0NzU1NDM1LCJleHAiOjE3NDQ3NjQwNzUsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.2nou13BAMlrk0VpDebJGHpfikdR0gk4f8IK2MOw1ymjSaweCeFCR4nZYtxp1WVzK`);

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
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ0NzU1NDM1LCJleHAiOjE3NDQ3NjQwNzUsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.2nou13BAMlrk0VpDebJGHpfikdR0gk4f8IK2MOw1ymjSaweCeFCR4nZYtxp1WVzK`);

    const request: ReactRequest = {
      idp: postId,
      type: type
    };

    this.http.post<React>('http://localhost:8080/Growthnest/api/reacts/add', request, { headers })
      .subscribe({
        next: () => {
          // Refresh both likes and dislikes counts after adding reaction
          this.fetchLikes(postId);
          this.fetchDislikes(postId);
        },
        error: err => console.error('Error adding reaction:', err)
      });
  }

  fetchReactions(postId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ0NzU1NDM1LCJleHAiOjE3NDQ3NjQwNzUsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.2nou13BAMlrk0VpDebJGHpfikdR0gk4f8IK2MOw1ymjSaweCeFCR4nZYtxp1WVzK`);

    this.http.get<React[]>(`http://localhost:8080/Growthnest/api/reacts/post/${postId}`, { headers })
      .subscribe({
        next: (reacts) => {
          this.reactionsMap[postId] = reacts;
        },
        error: err => console.error('Error fetching reactions:', err)
      });
  }

  getReactionCount(postId: number, type: 'LIKE' | 'DISLIKE'): number {
    return (this.reactionsMap[postId] || []).filter(react => react.type === type).length;
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none';
  }

  getMediaUrl(path: string): string {
    if (!path) return '';
    // Check if the path is already a full URL
    if (path.startsWith('http')) {
      return path;
    }
    // Handle local image paths
    if (path.startsWith('uploads/images/')) {
      return `${this.API_BASE_URL}/${path}`;
    }
    // Handle other cases
    return `${this.API_BASE_URL}${path}`;
  }

  deletePost(postId: number) {
    if (confirm('Are you sure you want to delete this post?')) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ0NzU1NDM1LCJleHAiOjE3NDQ3NjQwNzUsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.2nou13BAMlrk0VpDebJGHpfikdR0gk4f8IK2MOw1ymjSaweCeFCR4nZYtxp1WVzK`);

      this.http.delete(`http://localhost:8080/Growthnest/post/deletepost/${postId}`, { headers })
        .subscribe({
          next: () => {
            // Remove the post from the lists
            this.posts = this.posts.filter(post => post.idp !== postId);
            this.visiblePosts = this.visiblePosts.filter(post => post.idp !== postId);
          },
          error: err => console.error('Error deleting post:', err)
        });
    }
  }

  toggleEditForm(postId: number) {
    this.showEditFormMap[postId] = !this.showEditFormMap[postId];
    if (this.showEditFormMap[postId]) {
      // Initialize the edited post with current values
      const post = this.posts.find(p => p.idp === postId);
      this.editedPost[postId] = {
        title: post.title,
        content: post.content,
        tags: post.tags
      };
    }
  }

  updatePost(postId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ0NzU1NDM1LCJleHAiOjE3NDQ3NjQwNzUsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.2nou13BAMlrk0VpDebJGHpfikdR0gk4f8IK2MOw1ymjSaweCeFCR4nZYtxp1WVzK`);

    // Create the post object with the updated values
    const updatedPost = {
      idp: postId,
      title: this.editedPost[postId].title,
      content: this.editedPost[postId].content,
      tags: this.editedPost[postId].tags
    };

    this.http.put('http://localhost:8080/Growthnest/post/updatepost', updatedPost, { headers })
      .subscribe({
        next: (response: any) => {
          // Update the post in the lists
          const index = this.posts.findIndex(p => p.idp === postId);
          if (index !== -1) {
            this.posts[index] = { ...this.posts[index], ...response };
          }
          const visibleIndex = this.visiblePosts.findIndex(p => p.idp === postId);
          if (visibleIndex !== -1) {
            this.visiblePosts[visibleIndex] = { ...this.visiblePosts[visibleIndex], ...response };
          }
          this.showEditFormMap[postId] = false;
        },
        error: err => console.error('Error updating post:', err)
      });
  }

  toggleEditResponse(responseId: number, currentContent: string) {
    this.showEditResponseMap[responseId] = !this.showEditResponseMap[responseId];
    if (this.showEditResponseMap[responseId]) {
      this.editedResponse[responseId] = currentContent;
    }
  }

  updateResponse(responseId: number, postId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ0NzU1NDM1LCJleHAiOjE3NDQ3NjQwNzUsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.2nou13BAMlrk0VpDebJGHpfikdR0gk4f8IK2MOw1ymjSaweCeFCR4nZYtxp1WVzK`);

    const updatedResponse = {
      id: responseId,
      respons: this.editedResponse[responseId],
      post: { idp: postId }
    };

    this.http.patch('http://localhost:8080/Growthnest/respons/updaterespons', updatedResponse, { headers })
      .subscribe({
        next: (response: any) => {
          // Update the response in the list
          const index = this.responsesMap[postId].findIndex(r => r.id === responseId);
          if (index !== -1) {
            this.responsesMap[postId][index] = { ...this.responsesMap[postId][index], ...response };
          }
          this.showEditResponseMap[responseId] = false;
        },
        error: err => console.error('Error updating response:', err)
      });
  }

  deleteResponse(responseId: number, postId: number) {
    if (confirm('Are you sure you want to delete this response?')) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ0NzU1NDM1LCJleHAiOjE3NDQ3NjQwNzUsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.2nou13BAMlrk0VpDebJGHpfikdR0gk4f8IK2MOw1ymjSaweCeFCR4nZYtxp1WVzK`);

      this.http.delete(`http://localhost:8080/Growthnest/respons/deleterespons/${responseId}`, { headers })
        .subscribe({
          next: () => {
            // Remove the response from the list
            this.responsesMap[postId] = this.responsesMap[postId].filter(r => r.id !== responseId);
          },
          error: err => console.error('Error deleting response:', err)
        });
    }
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
  showAddPostModal = false;
newPost = {
  title: '',
  content: '',
  tags: ''
};
selectedImage?: File;
selectedVideo?: File;

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
  const headers = new HttpHeaders({
    Authorization: `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ0NzU1NDM1LCJleHAiOjE3NDQ3NjQwNzUsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.2nou13BAMlrk0VpDebJGHpfikdR0gk4f8IK2MOw1ymjSaweCeFCR4nZYtxp1WVzK`
  });

  this.http.post('http://localhost:8080/Growthnest/post/addPost', formData, { headers })
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

filterSaved() {
  this.visiblePosts = this.posts.filter(p => this.savedMap[p.idp]);
}

filterTrending() {
  this.visiblePosts = this.posts.filter(p => (this.likesMap[p.idp] || 0) >= 10);
}

filterRecent() {
  this.visiblePosts = [...this.posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

filterMyPosts() {
  const currentUserId = localStorage.getItem('userId'); // depends how you're storing it
  this.visiblePosts = this.posts.filter(p => p.user?.id === Number(currentUserId));
}
loadSavedPosts() {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ0NzU1NDM1LCJleHAiOjE3NDQ3NjQwNzUsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.2nou13BAMlrk0VpDebJGHpfikdR0gk4f8IK2MOw1ymjSaweCeFCR4nZYtxp1WVzK`);

  this.http.get<number[]>('http://localhost:8080/Growthnest/post/saved', { headers })
    .subscribe({
      next: (savedIds: number[]) => {
        this.savedMap = {};
        savedIds.forEach(id => this.savedMap[id] = true);
      },
      error: err => {
        console.error('Error loading saved posts:', err);
      }
    });
}
toggleSave(postId: number) {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InJpdGVqIGFpc3NhIiwic3ViIjoiYWlzc2FhbndhcjFAZ21haWwuY29tIiwiaWF0IjoxNzQ0NzU1NDM1LCJleHAiOjE3NDQ3NjQwNzUsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdfQ.2nou13BAMlrk0VpDebJGHpfikdR0gk4f8IK2MOw1ymjSaweCeFCR4nZYtxp1WVzK`);

  this.http.post(`http://localhost:8080/Growthnest/post/save/${postId}`, {}, { headers })
    .subscribe({
      next: () => {
        this.savedMap[postId] = !this.savedMap[postId]; // toggle UI
      },
      error: err => {
        console.error('Error saving post:', err);
      }
    });
}
fetchMyPosts(): void {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6ImFud2FyIGFpc3NhIiwic3ViIjoiYW53YXIuYWlzc2FqZXJiaUBlc3ByaXQudG4iLCJpYXQiOjE3NDQ1ODUzMDMsImV4cCI6MTc0NDU5Mzk0MywiYXV0aG9yaXRpZXMiOlsiUk9MRV9VU0VSIl19.E64-Ye8XdmuiOTMB1uqZRhIzX-bGBAEDTWYuiqPBsCc3kwfHUHWT_rCIsx5JNtUR`);

  this.http.get<any[]>('http://localhost:8080/Growthnest/post/myPosts', { headers })
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
      error: err => console.error('Error fetching user posts', err)
    });
}

onImageLoad(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  const postId = imgElement.getAttribute('data-post-id');
  if (postId) {
    this.imageLoadingStates[postId] = true;
  }
}

isImageLoading(postId: number): boolean {
  return !this.imageLoadingStates[postId];
}

}
