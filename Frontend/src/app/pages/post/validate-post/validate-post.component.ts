import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-validate-post',
  templateUrl: './validate-post.component.html',
  styleUrls: ['./validate-post.component.scss']
})
export class ValidatePostComponent implements OnInit {
  unvalidatedPosts: any[] = [];
  posts: any[] = [];
  visiblePosts: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUnvalidatedPosts();
  }

  loadUnvalidatedPosts(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6ImFkbWluIGFkbWluIiwic3ViIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE3NDQ3NTU4ODgsImV4cCI6MTc0NDc2NDUyOCwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdfQ.sazVbi6tXskxzPx06LKAJTfrRk5ShJiJb4RGwgWR2FpjlEA1DA0i6FawtGtVCQwc`
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
      `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6ImFkbWluIGFkbWluIiwic3ViIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE3NDQ3NTU4ODgsImV4cCI6MTc0NDc2NDUyOCwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdfQ.sazVbi6tXskxzPx06LKAJTfrRk5ShJiJb4RGwgWR2FpjlEA1DA0i6FawtGtVCQwc`
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
      const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InNhbGltIGhhZGRhcmkiLCJzdWIiOiJzYWxpbS5oYWRkYXJpQGVzcHJpdC50biIsImlhdCI6MTc0NDU4NTQxNiwiZXhwIjoxNzQ0NTk0MDU2LCJhdXRob3JpdGllcyI6WyJST0xFX1VTRVIiXX0.L7SxKTUqFbSaGBwJczvcrrt1ICqTUOIaeIYvx_7XI2VHg08atZ2rnoV6a8Gc3VRP`);

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
}
