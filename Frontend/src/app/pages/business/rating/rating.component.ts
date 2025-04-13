import { Component, EventEmitter, Input, Output } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { GestionDesBusinessService } from 'src/app/services/services';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent {
  @Input() businessId!: number;
  @Output() ratingSubmitted = new EventEmitter<void>();
  selectedRating: number = 0;
  userRating: number | null = null;
  hoverRating: number = 0; // Added for hover effect
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private businessService: GestionDesBusinessService) {}

  ngOnInit(): void {
    this.loadUserRating();
  }

  loadUserRating(): void {
    this.isLoading = true;
    this.businessService.getUserRating({ businessId: this.businessId }).pipe(
      catchError(() => of(null))
    ).subscribe((rating) => {
      this.userRating = rating;
      this.isLoading = false;
    });
  }

  rate(value: number): void {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.selectedRating = value;

    this.businessService
      .rateBusiness({ businessId: this.businessId, ratingValue: value })
      .pipe(
        tap(() => {
          this.userRating = value;
          this.ratingSubmitted.emit();
        }),
        catchError((err) => {
          this.errorMessage = err.error || 'Échec de la soumission de la note.';
          this.selectedRating = 0;
          return of(null);
        })
      )
      .subscribe(() => {
        this.isLoading = false;
      });
  }
}
