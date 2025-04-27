import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-validate-post',
  templateUrl: './validate-post.component.html',
  styleUrls: ['./validate-post.component.scss']
})
export class ValidatePostComponent implements OnInit {
  unvalidatedPosts: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUnvalidatedPosts();
  }

  loadUnvalidatedPosts(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6ImFkbWluIGFkbWluIiwic3ViIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE3NDU3MDcxNjIsImV4cCI6MTc0NTcxNTgwMiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdfQ.KPxqmZPefXjuIbPEAg1HTjyO9xbIVKiwFbi8EDWvDJXsqGFD0FxagltyKsQ7rYDQ`
    );

    this.http.get<any[]>('http://localhost:8080/Growthnest/post/unvalidated', { headers })
      .subscribe({
        next: data => this.unvalidatedPosts = data,
        error: err => console.error('Failed to load unvalidated posts', err)
      });
  }

  validatePost(postId: number): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6ImFkbWluIGFkbWluIiwic3ViIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE3NDU3MDcxNjIsImV4cCI6MTc0NTcxNTgwMiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdfQ.KPxqmZPefXjuIbPEAg1HTjyO9xbIVKiwFbi8EDWvDJXsqGFD0FxagltyKsQ7rYDQ`
    );

    this.http.post(`http://localhost:8080/Growthnest/post/validate/${postId}`, {}, { headers })
      .subscribe({
        next: () => {
          this.unvalidatedPosts = this.unvalidatedPosts.filter(post => post.idp !== postId);
        },
        error: err => console.error('Failed to validate post', err)
      });
  }

  deletePost(postId: number) {
    if (confirm('Are you sure you want to delete this post?')) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6ImFkbWluIGFkbWluIiwic3ViIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE3NDU3MDcxNjIsImV4cCI6MTc0NTcxNTgwMiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdfQ.KPxqmZPefXjuIbPEAg1HTjyO9xbIVKiwFbi8EDWvDJXsqGFD0FxagltyKsQ7rYDQ`);

      this.http.delete(`http://localhost:8080/Growthnest/post/deletepost/${postId}`, { headers })
        .subscribe({
          next: () => {
            this.unvalidatedPosts = this.unvalidatedPosts.filter(post => post.idp !== postId);
          },
          error: err => console.error('Error deleting post:', err)
        });
    }
  }

  selectedPost: any = null;

openModal(post: any) {
  this.selectedPost = post;
}

closeModal() {
  this.selectedPost = null;
}

}
