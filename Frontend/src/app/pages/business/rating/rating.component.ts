import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { GestionDesBusinessService } from 'src/app/services/services';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
  @Input() businessId!: number;
  @Output() ratingSubmitted = new EventEmitter<void>();
  userRating: number = 0;
  hoverRating: number = 0;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private businessService: GestionDesBusinessService) {}

  ngOnInit(): void {
    if (!this.businessId) {
      this.errorMessage = 'ID de l\'entreprise non fourni.';
      this.isLoading = false;
      console.error('RatingComponent: businessId is undefined or null');
      return;
    }
    this.loadUserRating();
  }

  loadUserRating(): void {
    this.isLoading = true;
    console.log('Loading user rating for businessId:', this.businessId);
    this.businessService.getUserRating({ businessId: this.businessId }).pipe(
      catchError((err) => {
        console.error('Erreur lors du chargement de la note:', err);
        this.errorMessage = 'Impossible de charger votre note.';
        this.isLoading = false;
        return of(0);
      })
    ).subscribe((rating) => {
      this.userRating = rating || 0;
      this.isLoading = false;
      console.log('Note chargée:', this.userRating, 'for businessId:', this.businessId);
    });
  }

  rate(value: number): void {
    if (this.isLoading || !this.businessId) {
      console.error('Cannot rate: isLoading=', this.isLoading, 'businessId=', this.businessId);
      this.errorMessage = 'Impossible de noter maintenant.';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    console.log('Submitting rating:', value, 'for businessId:', this.businessId);
    this.businessService
      .rateBusiness({ businessId: this.businessId, ratingValue: value })
      .pipe(
        tap(() => {
          this.userRating = value;
          this.ratingSubmitted.emit();
          console.log('Note soumise avec succès:', value);
        }),
        catchError((err) => {
          console.error('Erreur lors de la soumission de la note:', err);
          this.errorMessage = err.error?.message || 'Échec de la soumission de la note.';
          return of(null);
        })
      )
      .subscribe(() => {
        this.isLoading = false;
      });
  }
}