import { Component } from '@angular/core';
import { ReclamationType } from './FrontOffice/models/reclamation-type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  reclamationTypes = Object.values(ReclamationType);

}
