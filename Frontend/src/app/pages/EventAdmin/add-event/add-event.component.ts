import { Component } from '@angular/core';
import { Event } from '../../../services/models';
import { EventManagementService } from '../../../services/services/event-management.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-event-add',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class EventAddComponent {
  event: Event = {
    status: 'PLANNED' // Default status
  };
  isLoading = false;
  error: string | null = null;
  dateError: string | null = null;
  statusError: string | null = null;
  minDate: string;

  constructor(
    private eventService: EventManagementService,
    private router: Router
  ) {
    // Set minimum date to today for the date picker
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  validateDate(): void {
    if (!this.event.date) {
      this.dateError = 'Event date is required';
      return;
    }

    const selectedDate = new Date(this.event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part for accurate comparison

    if (selectedDate < today) {
      this.dateError = 'Event date must be today or in the future';
    } else {
      this.dateError = null;
    }

    // Cross-validate with status
    this.validateStatus();
  }

  validateStatus(): void {
    if (!this.event.status) {
      this.statusError = 'Status is required';
      return;
    }

    if (!this.event.date) {
      // Can't validate status without date
      return;
    }

    const selectedDate = new Date(this.event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (this.event.status === 'COMPLETED' || this.event.status === 'CANCELED') {
      if (selectedDate >= today) {
        this.statusError = 'Completed/Canceled events must have a past date';
      } else {
        this.statusError = null;
      }
    } else if (selectedDate < today) {
      this.statusError = 'Planned/Ongoing events must have today or a future date';
    } else {
      this.statusError = null;
    }
  }

  addEvent(form: NgForm) {
    // Trigger validation for all fields
    form.form.markAllAsTouched();
    
    // Run validations
    this.validateDate();
    this.validateStatus();

    // Don't submit if there are validation errors
    if (form.invalid || this.dateError || this.statusError) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.eventService.addEvent({ body: this.event }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/admin/events']);
      },
      error: (error) => {
        console.error('Error adding event', error);
        this.error = error.error?.message || 'Failed to add event. Please try again.';
        this.isLoading = false;
      }
    });
  }
}