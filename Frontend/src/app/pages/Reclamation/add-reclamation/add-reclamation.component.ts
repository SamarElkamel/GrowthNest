import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DeliveryAgency } from 'src/app/services/delivery-agency.service';
import { Reclamation, ReclamationService } from 'src/app/services/reclamation.service';

@Component({
  selector: 'app-add-reclamation',
  templateUrl: './add-reclamation.component.html',
  styleUrls: ['./add-reclamation.component.scss']
})
export class AddReclamationComponent {
  agencies: DeliveryAgency[] = [];

  displayModal = false;
  newReclamation: Reclamation = { type: '', description: '', reclamationDate: new Date() };
  @Output() added = new EventEmitter<void>();
  constructor(private reclamationService: ReclamationService) {}

  reclamationTypes: string[] = [];
  ngOnInit(): void {
  
    this.reclamationService.getReclamationTypes().subscribe(types => {
      this.reclamationTypes = types;
    });
  
  }
  save(form: NgForm) {
    this.reclamationService.add(this.newReclamation).subscribe(() => {
      this.added.emit();
      form.resetForm({ type: '', description: '', reclamationDate: new Date() }); // Réinitialisation clean
    });
  }
}
