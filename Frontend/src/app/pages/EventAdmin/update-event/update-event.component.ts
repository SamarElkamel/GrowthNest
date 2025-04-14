import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Event } from '../../../services/models';
import { EventManagementService } from '../../../services/services/event-management.service';

@Component({
  selector: 'app-event-update',
  templateUrl: './update-event.component.html',
  styleUrls: ['./update-event.component.scss']
})
export class EventUpdateComponent implements OnInit {
  event: Event = {
    status: 'PLANNED',
    numberOfPlaces: undefined // Initialize numberOfPlaces
  };
  isLoading = true;
  error: string | null = null;
  dateError: string | null = null;
  statusError: string | null = null;
  minDate: string;

  constructor(
    private eventService: EventManagementService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit() {
    const eventId = this.route.snapshot.params['id'];
    if (eventId) {
      this.loadEvent(+eventId);
    } else {
      this.error = 'No event ID provided';
      this.isLoading = false;
    }
  }

  loadEvent(eventId: number) {
    this.eventService.displayEvent({ idE: eventId }).subscribe(
      (response) => {
        this.event = {
          ...response,
          date: this.formatDateForInput(response.date),
          numberOfPlaces: response.numberOfPlaces // Ensure numberOfPlaces is loaded
        };
        this.isLoading = false;
        this.validateDate();
        this.validateStatus();
      },
      (error) => {
        console.error('Error loading event', error);
        this.error = 'Failed to load event';
        this.isLoading = false;
      }
    );
  }

  private formatDateForInput(date: string | Date | undefined): string | undefined {
    if (!date) {
      return undefined;
    }
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      console.warn('Invalid date received:', date);
      return undefined;
    }
    return parsedDate.toISOString().split('T')[0];
  }

  validateDate(): void {
    if (!this.event.date) {
      this.dateError = 'Event date is required';
      return;
    }

    const selectedDate = new Date(this.event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (this.event.status === 'PLANNED' || this.event.status === 'ONGOING') {
      if (selectedDate < today) {
        this.dateError = 'Planned/Ongoing events must have today or a future date';
      } else {
        this.dateError = null;
      }
    } else {
      this.dateError = null;
    }
  }

  validateStatus(): void {
    if (!this.event.status) {
      this.statusError = 'Status is required';
      return;
    }

    if (!this.event.date) {
      this.statusError = null;
      return;
    }

    const selectedDate = new Date(this.event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (this.event.status === 'COMPLETED' || this.event.status === 'CANCELED') {
      if (selectedDate > today) {
        this.statusError = 'Warning: Completed/Canceled events typically have a past date';
      } else {
        this.statusError = null;
      }
    } else if (this.event.status === 'PLANNED' || this.event.status === 'ONGOING') {
      if (selectedDate < today) {
        this.statusError = 'Planned/Ongoing events must have today or a future date';
      } else {
        this.statusError = null;
      }
    } else {
      this.statusError = null;
    }
  }

  updateEvent(form: NgForm) {
    form.form.markAllAsTouched();
    this.validateDate();
    this.validateStatus();

    // Validate numberOfPlaces
    if (this.event.numberOfPlaces !== undefined && this.event.numberOfPlaces < 1) {
      form.form.controls['numberOfPlaces'].setErrors({ min: true });
    }

    if (form.invalid || this.dateError) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    const eventToUpdate = {
      ...this.event,
      date: this.event.date,
      numberOfPlaces: this.event.numberOfPlaces // Ensure numberOfPlaces is included
    };

    this.eventService.updateEvent({ body: eventToUpdate }).subscribe(
      () => {
        this.isLoading = false;
        this.router.navigate(['/admin/events']);
      },
      (error) => {
        console.error('Error updating event', error);
        this.error = error.error?.message || 'Failed to update event. Please try again.';
        this.isLoading = false;
      }
    );
  }
}