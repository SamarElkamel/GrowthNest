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
      `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6ImFkbWluIGFkbWluIiwic3ViIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE3NDU3NzMyMDAsImV4cCI6MTc0NTc4MTg0MCwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdfQ.0GKyBDf4F6V7wvqJ9C4s3H7nU6pFk7rS3ChT2DvWsxbcZ73IgCJ4acm8FjnDfFQ8`
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
      `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6ImFkbWluIGFkbWluIiwic3ViIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE3NDU3NzMyMDAsImV4cCI6MTc0NTc4MTg0MCwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdfQ.0GKyBDf4F6V7wvqJ9C4s3H7nU6pFk7rS3ChT2DvWsxbcZ73IgCJ4acm8FjnDfFQ8`
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
      const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6ImFkbWluIGFkbWluIiwic3ViIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE3NDU3NzMyMDAsImV4cCI6MTc0NTc4MTg0MCwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdfQ.0GKyBDf4F6V7wvqJ9C4s3H7nU6pFk7rS3ChT2DvWsxbcZ73IgCJ4acm8FjnDfFQ8`);

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
