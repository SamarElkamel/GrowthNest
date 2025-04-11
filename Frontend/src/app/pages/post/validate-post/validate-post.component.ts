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
      `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6ImFkbWluIGFkbWluIiwic3ViIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE3NDQzNDI0MTEsImV4cCI6MTc0NDM1MTA1MSwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdfQ.zJnSi-M4zjClViIZkirdClqec5MAQ_TIP_n_XzhXBGodP5mdBujeVGvPW49Ach_2`
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
      `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6ImFkbWluIGFkbWluIiwic3ViIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE3NDQzNDI0MTEsImV4cCI6MTc0NDM1MTA1MSwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdfQ.zJnSi-M4zjClViIZkirdClqec5MAQ_TIP_n_XzhXBGodP5mdBujeVGvPW49Ach_2`
    );

    this.http.post(`http://localhost:8080/Growthnest/post/validate/${postId}`, {}, { headers })
      .subscribe({
        next: () => {
          this.unvalidatedPosts = this.unvalidatedPosts.filter(post => post.idp !== postId);
        },
        error: err => console.error('Failed to validate post', err)
      });
  }
}
