import { Component, OnInit } from '@angular/core';
import { Rating } from 'src/app/FrontOffice/models/rating';
import { RatingService } from 'src/app/services/rating.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
  ratings: Rating[] = [];
  newRating: Rating = { stars: 0, comment: '', username: 'Anonymous' };
  currentRating = 0;

  averageRating = 0;
  totalRatings = 0;
  ratingDistribution: { [key: number]: number } = {};
  sortOrder: 'asc' | 'desc' = 'desc';
Math: any;
Number: any;

  constructor(private ratingService: RatingService) {}

  ngOnInit() {
    this.loadRatings();
  }

  loadRatings() {
    this.ratingService.getAll().subscribe(data => {
      this.ratings = this.sortOrder === 'desc'
        ? [...data].sort((a, b) => (b.id || 0) - (a.id || 0))
        : [...data].sort((a, b) => (a.id || 0) - (b.id || 0));
      this.calculateStatistics();
    });
  }

  submitRating() {
    if (this.newRating.stars < 1 || !this.newRating.comment.trim()) {
      alert('Veuillez sélectionner une note et écrire un commentaire.');
      return;
    }
    this.ratingService.add(this.newRating).subscribe(() => {
      this.newRating = { stars: 0, comment: '', username: 'Anonymous' };
      this.currentRating = 0;
      this.loadRatings();
    });
  }

  deleteRating(id: number) {
    this.ratingService.delete(id).subscribe(() => this.loadRatings());
  }

  calculateStatistics() {
    const total = this.ratings.length;
    this.totalRatings = total;
    if (total === 0) {
      this.averageRating = 0;
      this.ratingDistribution = {};
      return;
    }

    const sum = this.ratings.reduce((acc, r) => acc + r.stars, 0);
    this.averageRating = sum / total;

    const dist: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    this.ratings.forEach(r => dist[r.stars]++);
    for (let i = 1; i <= 5; i++) {
      dist[i] = (dist[i] / total) * 100;
    }
    this.ratingDistribution = dist;
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
    this.loadRatings();
  }
  getAverageStarClass(index: number): string {
    if (index <= Math.floor(this.averageRating)) return 'fas fa-star';
    if (index === Math.ceil(this.averageRating) && !Number.isInteger(this.averageRating)) return 'fas fa-star-half-alt';
    return 'far fa-star';
  }
  getInitials(name: string): string {
    const parts = name.trim().split(' ');
    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].substring(0, 2).toUpperCase();
  }
}