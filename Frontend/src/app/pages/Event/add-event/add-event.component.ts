import { Component } from '@angular/core';
import { Event } from '../../../services/models';
import { EventManagementService } from '../../../services/services/event-management.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent {
  newEvent: Event = {
    title: '',
    description: '',
    date: '',
    location: '',
    status: 'PLANNED'
  };

  constructor(private eventService: EventManagementService) {}

  onSubmit() {
    this.eventService.addEvent({ body: this.newEvent }).subscribe(
      (response) => {
        console.log('Event added successfully', response);
        // Reset form or navigate away
        this.newEvent = {
          title: '',
          description: '',
          date: '',
          location: '',
          status: 'PLANNED'
        };
      },
      (error) => {
        console.error('Error adding event', error);
      }
    );
  }
}