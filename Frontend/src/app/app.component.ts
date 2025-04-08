import { Component } from '@angular/core';
import { Router } from '@angular/router';  // Add this import

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(private router: Router) {}

  isFrontOfficePage(): boolean {
    return !this.router.url.startsWith('/admin');
  }
}
