import { Component, OnInit } from '@angular/core';
import { DeliveryAgency, DeliveryAgencyService } from 'src/app/services/delivery-agency.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-delivery-agency-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delivery-agency-dashboard.component.html',
  styleUrls: ['./delivery-agency-dashboard.component.scss']
})
export class DeliveryAgencyDashboardComponent implements OnInit {
  deliveryAgencies: DeliveryAgency[] = [];
  filteredAgencies: DeliveryAgency[] = [];

  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 2;
  totalPages: number = 1;

  constructor(private deliveryAgencyService: DeliveryAgencyService) {}

  ngOnInit(): void {
    this.deliveryAgencyService.getAll().subscribe(data => {
      this.deliveryAgencies = data;
      this.applyFilters();
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredAgencies = this.deliveryAgencies.filter(agency =>
      agency.agencyName.toLowerCase().includes(term) ||
      agency.address.toLowerCase().includes(term)
    );
    this.totalPages = Math.ceil(this.filteredAgencies.length / this.pageSize);
    this.currentPage = 1;
  }

  paginate(): DeliveryAgency[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredAgencies.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }
}
