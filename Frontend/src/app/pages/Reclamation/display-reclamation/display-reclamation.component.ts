import { Component } from '@angular/core';
import { Reclamation, ReclamationService } from 'src/app/services/reclamation.service';
import { ReportService } from 'src/app/services/report.service'; // Import ajouté
import { ReclamationType } from 'src/app/FrontOffice/models/reclamation-type';
import * as saveAs from 'file-saver';
import { HttpErrorResponse } from '@angular/common/http';
import { ReclamationStatus } from 'src/app/FrontOffice/models/reclamationstatus';

@Component({
  selector: 'app-display-reclamation',
  templateUrl: './display-reclamation.component.html',
  styleUrls: ['./display-reclamation.component.scss']
})
export class DisplayReclamationComponent {

  reclamations: Reclamation[] = [];
  filteredReclamations: Reclamation[] = [];
  reclamationTypes = Object.values(ReclamationType);
  reclamationStatuses = Object.values(ReclamationStatus); // Ajouté pour le filtrage
  selectedType: string = 'ALL';
  selectedStatus: string = 'ALL'; // Nouveau filtre pour le statut

  displayEditModal = false;
  editingReclamation: Reclamation = {
    type: ReclamationType.DELIVERY,
    description: '',
    reclamationDate: new Date(),
    status:ReclamationStatus.PENDING
  };

  constructor(
    private reclamationService: ReclamationService,
    private reportService: ReportService // Service injecté
  ) {}

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
    this.filteredReclamations = this.reclamations.filter(rec => {
      const typeMatch = this.selectedType === 'ALL' || rec.type === this.selectedType;
      const statusMatch = this.selectedStatus === 'ALL' || rec.status === this.selectedStatus;
      return typeMatch && statusMatch;
    });
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

  generatePdfReport() {
    this.reportService.generateReclamationsPdf().subscribe({
      next: (pdfBlob: Blob) => {
        saveAs(pdfBlob, `reclamations_report_${new Date().toISOString().slice(0, 10)}.pdf`);
      },
      error: (error: HttpErrorResponse) => { // Typage plus spécifique
        console.error('Erreur lors de la génération du PDF:', error);
        if (error.status === 403) {
          alert('Vous n\'avez pas les permissions nécessaires');
        } else {
          alert('Erreur lors de la génération du rapport');
        }
      }
    });
  }


}
