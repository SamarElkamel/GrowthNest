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
  newRating: Rating = { stars: 0, comment: '' };
  currentRating = 0;

  constructor(private ratingService: RatingService) {}

  ngOnInit() {
    this.loadRatings();
  }

  loadRatings() {
    this.ratingService.getAll().subscribe(data => this.ratings = data);
  }


  
  submitRating() {
    if (this.newRating.stars < 1 || !this.newRating.comment.trim()) {
      alert('Veuillez sélectionner une note et écrire un commentaire.');
      return;
    }
    this.ratingService.add(this.newRating).subscribe(() => {
      this.newRating = { stars: 0, comment: '' };
      this.currentRating = 0;
      this.loadRatings();
    });
  }

  deleteRating(id: number) {
    this.ratingService.delete(id).subscribe(() => this.loadRatings());
  }
}
