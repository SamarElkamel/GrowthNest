import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { Business } from 'src/app/services/models';
import { GestionDesBusinessService } from 'src/app/services/services';
import { BusinessDetailCardComponent } from '../../business-detail-card/business-detail-card.component';

@Component({
  selector: 'app-business-list',
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.scss']
})
export class BusinessListComponent implements OnInit {
  businesses: Business[] = [];
  @Input() business: any;
  columns = [
    { label: 'Nom', class: 'name-col' },
    { label: 'Catégorie', class: 'category-col' },
    { label: 'Description', class: 'description-col' },
    { label: 'Actions', class: 'actions-col' }
  ];

  constructor(private businessService: GestionDesBusinessService,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadBusinesses();
  }
  selectedRow: number | null = null;

  getCategoryStyle(category: string): string {
    return category ? category.toUpperCase() : 'non-classe';
  }

 /* async loadBusinesses() {
    try {
      const response$ = this.businessService.getAllBusiness();
      this.businesses = await lastValueFrom(response$);
    } catch (error) {
      console.error('Error loading businesses', error);
    }
  }*/
    loadBusinesses() {
      this.businessService.getAllBusiness().subscribe({
        next: (businesses) => this.businesses = businesses,
        error: (err) => console.error('Error:', err)
      });
    }
    deleteBusiness(idB: number) {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce business ?')) {
        // Correction : Passer un objet { id } conforme à DeleteBusiness$Params
        this.businessService.deleteBusiness({ idB }).subscribe({
          next: () => {
            this.businesses = this.businesses.filter(b => b.idBusiness !== idB);
          },
          error: (err) => console.error('Erreur de suppression', err)
        });
      }
    }
    getCategoryClass(category: string) {
      switch(category?.toUpperCase()) {
        case 'CUISINE': return 'bg-culinary text-culinary-dark';
        case 'BIJOUX': return 'bg-jewelry text-jewelry-dark';
        case 'MODE': return 'bg-fashion text-fashion-dark';
        case 'ARTISANAT': return 'bg-craft text-craft-dark';
        case 'BEAUTE': return 'bg-beauty text-beauty-dark';
        case 'DECORATION': return 'bg-decoration text-decoration-dark';
        case 'SERVICES': return 'bg-services text-services-dark';
        default: return 'bg-secondary text-dark';
      }
    }
    openDetailsDialog(business: any) {
      this.dialog.open(BusinessDetailCardComponent, {
        width: '600px',
        data: business
      });
}}