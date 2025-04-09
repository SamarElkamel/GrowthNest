import { Component, OnInit } from '@angular/core';
import { OffreService } from 'src/app/services/GestionMarketingServices/offre.service';
import { TypeOffreService } from 'src/app/services/GestionMarketingServices/type-offre.service';
import { Offre } from 'src/app/models/GestionMarketingModels/offre.model';
import { TypeOffre } from 'src/app/models/GestionMarketingModels/type-offre.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-offres',
  templateUrl: './manage-offres.component.html',
  styleUrls: ['./manage-offres.component.scss']
})
export class ManageOffresComponent implements OnInit {
  offres: Offre[] = [];
  filteredOffres: Offre[] = [];
  types: TypeOffre[] = [];
  searchQuery: string = '';
  editingId: number | null = null;
  editOffre: Offre = {
    id: 0,
    nom: '',
    description: '',
    prix: 0,
    typeOffre: { id: 0, nom: '' }
  };
  
  


  constructor(
    private offreService: OffreService,
    private typeService: TypeOffreService,
    private toastr: ToastrService
  ) {}
  selectedTypeId: number | null = null;


  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.offreService.getAllOffres().subscribe((data) => {
      this.offres = data;
      this.filter(); // applique les filtres en cours (nom + type)
    });
  
    this.typeService.getAllTypes().subscribe((types) => {
      this.types = types;
    });
  }
  

  filter(): void {
    this.filteredOffres = this.offres.filter(offre => {
      const matchesName = offre.nom.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesType = this.selectedTypeId === null || offre.typeOffre?.id === this.selectedTypeId;
      return matchesName && matchesType;
    });
  }
  
  startEdit(offre: Offre): void {
    this.editingId = offre.id!;
    this.editOffre = { ...offre }; // cloner l'objet pour l'éditer sans modifier la liste directement
  }
  
  saveEdit(): void {
    if (this.editingId !== null) {
      this.offreService.updateOffre(this.editingId, this.editOffre).subscribe(() => {
        this.toastr.success("Offer updated successfully", "Success");
        this.editingId = null;
        this.loadData();
      });
    }
  }
  
  cancelEdit(): void {
    this.editingId = null;
  }
  

  deleteOffre(id: number) {
    this.offreService.deleteOffre(id).subscribe(() => {
      this.toastr.success("Offer deleted successfully", "Success");
      this.loadData();
    });
  }

  deleteType(id: number) {
    this.typeService.deleteTypeOffre(id).subscribe(() => {
      this.toastr.success("Type deleted successfully", "Success");
      this.loadData();
    });
  }
}
