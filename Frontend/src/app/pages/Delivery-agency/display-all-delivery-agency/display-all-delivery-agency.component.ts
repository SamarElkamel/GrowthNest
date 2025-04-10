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
  constructor(private agencyService: DeliveryAgencyService,private reclamationService: ReclamationService) {}

  ngOnInit(): void {
    this.agencyService.getAll().subscribe(data => {
      this.agencies = data;
      console.log(this.agencies);
      
    });
  }




  openModal() {
    this.displayModal = true;
  }
  closeModal() {
    this.displayModal = false;
  }
  save() {
    this.reclamationService.add(this.newReclamation).subscribe(() => {
      this.closeModal();
      this.added.emit();
      this.newReclamation = { type: '', description: '', reclamationDate: new Date() };
    });
  }
}
