import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Business } from 'src/app/services/models';
import { GestionDesBusinessService } from 'src/app/services/services';

declare var $: any;
declare var swal: any;
@Component({
  selector: 'app-business-list-front',
  templateUrl: './business-list-front.component.html',
  styleUrls: ['./business-list-front.component.scss']
})


export class BusinessListFrontComponent {
   businesses: Business[] = [];
   @Input() business: any;
 

  
    constructor(private businessService: GestionDesBusinessService,private router: Router) { }
  
    ngOnInit(): void {
      this.loadBusinesses();
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
      ngAfterViewInit(): void {
        this.initializeSelect2();
        this.initializeParallax();
        // ... autres initialisations
      }
    
      private initializeSelect2(): void {
        $('.js-select2').each(function(this: HTMLElement) { // <-- Ajouter le type ici
          $(this).select2({
            minimumResultsForSearch: 20,
            dropdownParent: $(this).next('.dropDownSelect2')
          });
        });
      }
    
      private initializeParallax(): void {
        $('.parallax100').parallax100();
      }
      onBusinessClick(businessId: number): void {
        this.router.navigate(['/business', businessId, 'products']);
      }
      viewProducts(businessId: number): void {
        if (businessId) {
          this.router.navigate(['/business', businessId, 'products']);
        } else {
          console.error('ID Business non trouvé dans l\'objet:', this.business);
        }
      } 
}
