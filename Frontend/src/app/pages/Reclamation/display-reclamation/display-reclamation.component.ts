import { Component } from '@angular/core';
import { ReclamationService } from 'src/app/services/reclamation.service';
export interface Reclamation {
  reclamationId?: number;
  type: string;
  description: string;
  reclamationDate?: Date;
}
@Component({
  selector: 'app-display-reclamation',
  templateUrl: './display-reclamation.component.html',
  styleUrls: ['./display-reclamation.component.scss']
})
export class DisplayReclamationComponent {
  reclamations: Reclamation[] = [];
  displayEditModal = false;
  editingReclamation: Reclamation = { type: '', description: '', reclamationDate: new Date() };

  constructor(private reclamationService: ReclamationService) {}

  ngOnInit() {
    this.loadReclamations();
  }

  loadReclamations() {
    this.reclamationService.getAll().subscribe(data => this.reclamations = data);
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
