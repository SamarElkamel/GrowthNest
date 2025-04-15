import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DeliveryAgency, DeliveryAgencyService } from 'src/app/services/delivery-agency.service';
import { Reclamation, ReclamationService } from 'src/app/services/reclamation.service';

@Component({
  selector: 'app-display-all-delivery-agency',
  templateUrl: './display-all-delivery-agency.component.html',
  styleUrls: ['./display-all-delivery-agency.component.scss']
})
export class DisplayAllDeliveryAgencyComponent implements OnInit {
  agencies: DeliveryAgency[] = [];

  displayModal = false;
  newReclamation: Reclamation = { type: '', description: '', reclamationDate: new Date() };
  @Output() added = new EventEmitter<void>();
  searchTerm: string = '';
filteredAgencies: DeliveryAgency[] = [];
currentPage = 1;
itemsPerPage = 2;
  constructor(private agencyService: DeliveryAgencyService,private reclamationService: ReclamationService) {}

  reclamationTypes: string[] = [];

  ngOnInit(): void {
    this.agencyService.getAll().subscribe(data => {
      this.agencies = data;
      this.filterAndPaginate();

    });
  
  }
  filterAndPaginate() {
    const filtered = this.agencies.filter(a =>
      a.agencyName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      a.address.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      a.phoneNumber.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.filteredAgencies = filtered.slice(start, end);
  }
  onPageChanged(page: number) {
    this.currentPage = page;
    this.filterAndPaginate();
  }
  onSearchChange() {
    this.currentPage = 1; 
    this.filterAndPaginate();
  }
  get filteredTotalItems(): number {
    return this.agencies.filter(a =>
      a.agencyName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      a.address.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      a.phoneNumber.toLowerCase().includes(this.searchTerm.toLowerCase())
    ).length;
  }
}
