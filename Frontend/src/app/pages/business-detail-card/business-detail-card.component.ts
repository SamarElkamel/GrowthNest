
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Business } from 'src/app/services/models';
@Component({
  selector: 'app-business-detail-card',
  templateUrl: './business-detail-card.component.html',
  styleUrls: ['./business-detail-card.component.scss']
})
export class BusinessDetailCardComponent {
  constructor(
    public dialogRef: MatDialogRef<BusinessDetailCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Business
  ) {}
}
