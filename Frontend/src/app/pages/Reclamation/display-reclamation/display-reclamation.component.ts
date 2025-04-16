import { Component } from '@angular/core';
import { Reclamation, ReclamationService } from 'src/app/services/reclamation.service';
import { ReportService } from 'src/app/services/report.service'; // Import ajouté
import { ReclamationType } from 'src/app/FrontOffice/models/reclamation-type';
import * as saveAs from 'file-saver';
import { HttpErrorResponse } from '@angular/common/http';

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
  editingReclamation: Reclamation = {
    type: ReclamationType.DELIVERY,
    description: '', 
    reclamationDate: new Date() 
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
    if (this.selectedType === 'ALL') {
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