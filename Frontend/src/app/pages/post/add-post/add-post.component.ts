import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss']
})
export class AddPostComponent {
  post = {
    title: '',
    content: '',
    tags: ''
  };

  selectedImage?: File;
  selectedVideo?: File;

  constructor(private http: HttpClient, private router: Router) {}

  onFileSelected(event: any, type: 'image' | 'video') {
    const file = event.target.files[0];
    if (type === 'image') {
      this.selectedImage = file;
    } else if (type === 'video') {
      this.selectedVideo = file;
    }
  }

  onSubmit() {
    if (!this.post.title.trim()) {
      alert('Title is required');
      return;
    }
  
    if (!this.post.content.trim()) {
      alert('Content is required');
      return;
    }
  
    if (!this.post.tags.trim()) {
      alert('Please select a tag');
      return;
    }
  
    const formData = new FormData();
    formData.append('title', this.post.title);
    formData.append('content', this.post.content);
    formData.append('tags', this.post.tags);
    formData.append('validated', 'true');
  
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }
  
    if (this.selectedVideo) {
      formData.append('video', this.selectedVideo);
    }
  
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6ImFkbWluIGFkbWluIiwic3ViIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpYXQiOjE3NDU4NDU5ODcsImV4cCI6MTc0NTg1NDYyNywiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdfQ.psFCiaUsrvK3fgyTPtlQTVXk9TrXgbrbHvTUlZBCb9S_ghsx2ZfGlaOjgiS2BXiK`
    });
  
    this.http.post('http://localhost:8080/Growthnest/post/addPostAdmin', formData, { headers })
      .subscribe({
        next: () => {
          alert('✅ Post added successfully!');
          this.router.navigate(['/admin/posts']);
        },
        error: err => {
          alert('❌ Failed to add post: ' + err.message);
        }
      });
  }
  
}
