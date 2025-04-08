import { Component, OnInit } from '@angular/core';
import { Event } from '../../../services/models';
import { EventManagementService } from '../../../services/services/event-management.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.component.html',
  styleUrls: ['./update-event.component.scss']
})
export class UpdateEventComponent implements OnInit {
  event: Event = {
    title: '',
    description: '',
    date: '',
    location: '',
    status: 'PLANNED'
  };

  constructor(
    private eventService: EventManagementService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const eventId = this.route.snapshot.params['id'];
    if (eventId) {
      this.eventService.displayEvent({ idE: +eventId }).subscribe(
        (response) => {
          this.event = response;
        },
        (error) => {
          console.error('Error fetching event', error);
        }
      );
    }
  }

  onSubmit() {
    this.eventService.updateEvent({ body: this.event }).subscribe(
      (response) => {
        console.log('Event updated successfully', response);
        // Optionally navigate away or show success message
      },
      (error) => {
        console.error('Error updating event', error);
      }
    );
  }
}