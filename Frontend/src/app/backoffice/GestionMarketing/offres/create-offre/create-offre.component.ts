import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Offre } from 'src/app/models/GestionMarketingModels/offre.model';
import { TypeOffre } from 'src/app/models/GestionMarketingModels/type-offre.model';
import { OffreService } from 'src/app/services/GestionMarketingServices/offre.service';
import { TypeOffreService } from 'src/app/services/GestionMarketingServices/type-offre.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-offre',
  templateUrl: './create-offre.component.html',
  styleUrls: ['./create-offre.component.scss']
})
export class CreateOffreComponent implements OnInit {
  formType!: FormGroup;
  formOffre!: FormGroup;
  typesOffre: TypeOffre[] = [];

  constructor(
    private fb: FormBuilder,
    private offreService: OffreService,
    private typeService: TypeOffreService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.formType = this.fb.group({
      nom: ['', Validators.required]
    });

    this.formOffre = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      prix: [0, [Validators.required, Validators.min(0)]],
      typeOffre: [null, Validators.required]
    });

    this.loadTypesOffre();
  }

  loadTypesOffre() {
    this.typeService.getAllTypes().subscribe((data) => {
      this.typesOffre = data;
    });
  }

  submitType() {
    if (this.formType.valid) {
      this.toastr.success("Offer type added successfully 🎉", "Success", {
        timeOut: 3000,
        closeButton: true
      });

      this.typeService.createTypeOffre(this.formType.value).subscribe(() => {
        this.formType.reset();
        this.loadTypesOffre();
      });
    }
  }

  preventNegative(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }

  submitOffre() {
    if (this.formOffre.valid) {
      const raw = this.formOffre.value;

      const payload: Offre = {
        nom: raw.nom,
        description: raw.description,
        prix: raw.prix,
        typeOffre: {
          id: raw.typeOffre.id,
          nom: raw.typeOffre.nom // requis côté Spring Boot
        }
      };

      this.offreService.createOffre(payload).subscribe({
        next: () => {
          this.toastr.success("Offer successfully created 🎯", "Success", {
            timeOut: 3000,
            closeButton: true,
            positionClass: 'toast-top-right'
          });
          this.formOffre.reset();
        },
        error: (error) => {
          this.toastr.error("An error occurred while creating the offer", "Error");
          console.error(error);
        }
      });
    }
  }
}
