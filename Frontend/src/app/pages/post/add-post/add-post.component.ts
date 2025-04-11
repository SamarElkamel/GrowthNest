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
  
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }
  
    if (this.selectedVideo) {
      formData.append('video', this.selectedVideo);
    }
  
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer eyJhbGciOiJIUzM4NCJ9.eyJmdWxsTmFtZSI6InNhbGltIGhhZGRhcmkiLCJzdWIiOiJzYWxpbS5oYWRkYXJpQGVzcHJpdC50biIsImlhdCI6MTc0NDM0MjI2OCwiZXhwIjoxNzQ0MzUwOTA4LCJhdXRob3JpdGllcyI6WyJST0xFX1VTRVIiXX0.tO5ZB2vz4Ok4hDJWBzoboj7A6EAkKsqGYzyxIN2SR2w96NpkaLC7Uo6RExBGA2Bw`
    });
  
    this.http.post('http://localhost:8080/Growthnest/post/addPost', formData, { headers })
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
