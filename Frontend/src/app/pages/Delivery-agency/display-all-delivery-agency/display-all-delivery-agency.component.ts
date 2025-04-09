import { Component, OnInit } from '@angular/core';
import { DeliveryAgency, DeliveryAgencyService } from 'src/app/services/delivery-agency.service';

@Component({
  selector: 'app-display-all-delivery-agency',
  templateUrl: './display-all-delivery-agency.component.html',
  styleUrls: ['./display-all-delivery-agency.component.scss']
})
export class DisplayAllDeliveryAgencyComponent implements OnInit {
  agencies: DeliveryAgency[] = [];

  constructor(private agencyService: DeliveryAgencyService) {}

  ngOnInit(): void {
    this.agencyService.getAll().subscribe(data => {
      this.agencies = data;
    });
  }
}
