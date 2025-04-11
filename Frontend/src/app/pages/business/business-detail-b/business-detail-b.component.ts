import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Business } from 'src/app/services/models';
import { GestionDesBusinessService } from 'src/app/services/services';

@Component({
  selector: 'app-business-detail-b',
  templateUrl: './business-detail-b.component.html',
  styleUrls: ['./business-detail-b.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        animate('0.5s ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})

export class BusinessDetailBComponent implements OnInit{
  business?: Business;
  isLoading = true;
  private destroy$ = new Subject<void>(); // Pour gérer la désinscription

  constructor(
    private route: ActivatedRoute,
    private businessService: GestionDesBusinessService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('idBusiness');
    if (id) {
      this.loadBusiness(+id);
    } else {
      console.error('ID du business non fourni');
      this.isLoading = false; // Pas d'ID, on arrête le chargement
    }
  }

  private loadBusiness(id: number): void {
    this.isLoading = true;
    this.businessService
      .getBusinessById({ idB: id })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.business = res;
          this.isLoading = false; // Données chargées, on arrête le spinner
        },
        error: (err) => {
          console.error('Erreur lors du chargement du business', err);
          this.isLoading = false; // En cas d'erreur, on arrête le spinner
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete(); // Nettoie l'abonnement
  }
  
  
 
}
