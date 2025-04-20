import { Component, HostListener } from '@angular/core';
import { PointsService } from 'src/app/services/points.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isScrolled = false;
  userId = 1; // statically or from auth
  points: number = 0;
  constructor(private pointsService: PointsService) {}

  ngOnInit(): void {
    this.pointsService.getPoints(this.userId).subscribe({
      next: (data) => this.points = data.availablePoints,
      error: () => this.points = 0
    });
  }
  @HostListener('window:scroll', [])
  onScroll(): void {
    this.isScrolled = window.scrollY > 30; // adjust if needed
  }
}
