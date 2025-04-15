import { Component } from '@angular/core';
import { Reclamation, ReclamationService } from 'src/app/services/reclamation.service';
import { ReclamationType } from 'src/app/FrontOffice/models/reclamation-type';

@Component({
  selector: 'app-display-reclamation',
  templateUrl: './display-reclamation.component.html',
  styleUrls: ['./display-reclamation.component.scss']
})
export class DisplayReclamationComponent {
  reclamations: Reclamation[] = [];
  filteredReclamations: Reclamation[] = [];
  reclamationTypes = Object.values(ReclamationType);
  selectedType: string = 'ALL';

  displayEditModal = false;
  editingReclamation: Reclamation = {type: ReclamationType.DELIVERY,
     description: '', reclamationDate: new Date() };

  constructor(private reclamationService: ReclamationService) {}

  ngOnInit() {
    this.loadReclamations();
  }

  loadReclamations() {
    this.reclamationService.getAll().subscribe(data => {
      this.reclamations = data.map(rec => ({
        ...rec,
        type: rec.type as ReclamationType
      }));
      this.applyFilter();
    });
  }

  applyFilter() {
    if (this.selectedType  === 'ALL') {
      this.filteredReclamations = this.reclamations;
    } else {
      this.filteredReclamations = this.reclamations.filter(
        r => r.type === this.selectedType as ReclamationType
      );
    }
  }

  delete(id: number) {
    if (confirm('Êtes-vous sûr ?')) {
      this.reclamationService.delete(id).subscribe(() => this.loadReclamations());
    }
  }

  openEditModal(reclamation: Reclamation) {
    this.editingReclamation = { ...reclamation };
    this.displayEditModal = true;
  }

  closeEditModal() {
    this.displayEditModal = false;
  }

  update() {
    this.reclamationService.update(this.editingReclamation).subscribe(() => {
      this.loadReclamations();
      this.closeEditModal();
    });
  }
}
