import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { GestionDesBusinessService } from 'src/app/services/services';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

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

  constructor(
    private businessService: GestionDesBusinessService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (!this.businessId) {
      this.errorMessage = 'ID de l\'entreprise non fourni.';
      this.isLoading = false;
      console.error('RatingComponent: businessId is undefined or null');
      this.snackBar.open(this.errorMessage, 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
      return;
    }
    this.loadUserRating();
  }

  loadUserRating(): void {
    this.isLoading = true;
    console.log('Loading user rating for businessId:', this.businessId);
    this.businessService.getUserRating({ businessId: this.businessId }).pipe(
      tap((rating) => {
        this.userRating = rating || 0;
        console.log('Note chargée:', this.userRating, 'for businessId:', this.businessId);
      }),
      catchError((err) => {
        console.error('Erreur lors du chargement de la note:', err);
        this.errorMessage = err.error?.error || 'Impossible de charger votre note.';
        this.snackBar.open(this.errorMessage, 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
        return of(0);
      })
    ).subscribe(() => {
      this.isLoading = false;
    });
  }

  rate(value: number): void {
    if (this.isLoading || !this.businessId) {
      console.error('Cannot rate: isLoading=', this.isLoading, 'businessId=', this.businessId);
      this.errorMessage = 'Impossible de noter maintenant.';
      this.snackBar.open(this.errorMessage, 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    console.log('Submitting rating:', value, 'for businessId:', this.businessId);
    this.businessService.rateBusiness({ businessId: this.businessId, ratingValue: value }).pipe(
      tap(() => {
        this.userRating = value;
        this.ratingSubmitted.emit();
        Swal.fire({
                    title: 'Succès',
                    text: 'Note soumise avec succès !',
                    icon: 'success',
                    confirmButtonText: 'fermer'
                  })
       // this.snackBar.open('Note soumise avec succès !', 'Fermer', { duration: 3000, panelClass: ['success-snackbar'] });
        console.log('Note soumise avec succès:', value);
      }),
      catchError((err) => {
        console.error('Erreur lors de la soumission de la note:', err);
        this.errorMessage = err.error?.error || 'Échec de la soumission de la note.';
        this.snackBar.open(this.errorMessage, 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
        return of(null);
      })
    ).subscribe(() => {
      this.isLoading = false;
    });
  }

  setHoverRating(value: number): void {
    this.hoverRating = value;
  }

  clearHoverRating(): void {
    this.hoverRating = 0;
  }
}