import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DeliveryAgency } from 'src/app/services/delivery-agency.service';
import { Reclamation, ReclamationService } from 'src/app/services/reclamation.service';
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-add-reclamation',
  templateUrl: './add-reclamation.component.html',
  styleUrls: ['./add-reclamation.component.scss']
})
export class AddReclamationComponent {
  agencies: DeliveryAgency[] = [];
  displayModal = false;

  newReclamation: Reclamation = { type: '', description: '', reclamationDate: new Date() };
  reclamationTypes: string[] = [];

  @Output() added = new EventEmitter<void>();

  // Propriétés pour messages
  message: string = '';
  level: 'success' | 'error' = 'success';

  constructor(
    private reclamationService: ReclamationService,
    private toastService: ToastrService){
}
  ngOnInit(): void {
    this.reclamationService.getReclamationTypes().subscribe(types => {
      this.reclamationTypes = types;
    });
  }

  // Nouvelle méthode
  setMessage(level: 'success' | 'error', message: string) {
    this.level = level;
    this.message = message;

    // Disparaître automatiquement après 3 secondes
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  save(form: NgForm) {
    this.reclamationService.add(this.newReclamation).subscribe({
      next: () => {
        this.toastService.success('Réclamation ajoutée avec succès');
      },
      error: (err) => {
       this.toastService.error(err.error.error,'oups !!')
      }
    });
  }
}
