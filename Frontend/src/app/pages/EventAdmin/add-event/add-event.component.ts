import { Component } from '@angular/core';
import { Event } from '../../../services/models';
import { EventManagementService } from '../../../services/services/event-management.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-add',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class EventAddComponent {
  event: Event = {};
  isLoading = false;
  error: string | null = null;

  constructor(
    private eventService: EventManagementService,
    private router: Router
  ) {}

  addEvent() {
    this.isLoading = true;
    this.eventService.addEvent({ body: this.event }).subscribe(
      () => {
        this.isLoading = false;
        this.router.navigate(['/admin/events']);
      },
      (error) => {
        console.error('Error adding event', error);
        this.error = 'Failed to add event';
        this.isLoading = false;
      }
    );
  }
}