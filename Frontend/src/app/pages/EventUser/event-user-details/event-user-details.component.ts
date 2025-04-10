import { Component, OnInit } from '@angular/core';
import { Event, Registration } from '../../../services/models';
import { EventManagementService } from '../../../services/services/event-management.service';
import { RegistrationManagementService } from '../../../services/services/registration-management.service';
import { ActivatedRoute, Router } from '@angular/router'; // Add Router

@Component({
  selector: 'app-event-user-details',
  templateUrl: './event-user-details.component.html'
})
export class EventUSerDetailsComponent implements OnInit {
  event: Event | null = null;
  userReservations: Registration[] = [];
  isLoading = true;
  error: string | null = null;
  showAddForm = false;
  hasReservation = false;
  notification: string | null = null;

  constructor(
    private eventService: EventManagementService,
    private registrationService: RegistrationManagementService,
    private route: ActivatedRoute,
    private router: Router // Inject Router
  ) {}

  ngOnInit() {
    const eventId = this.route.snapshot.params['id'];
    this.loadEventDetails(eventId);
    this.checkUserReservation(eventId);
  }

  loadEventDetails(id: number) {
    this.isLoading = true;
    this.eventService.displayEvent({ idE: id }).subscribe(
      (response) => {
        this.event = response;
        this.isLoading = false;
      },
      (error) => {
        this.error = 'Failed to load event details';
        this.isLoading = false;
      }
    );
  }

  checkUserReservation(eventId: number) {
    const userId = 1; // Static user ID for testing; replace with auth later
    this.registrationService.getUserReservations({ userId }).subscribe(
      (reservations) => {
        this.userReservations = reservations || [];
        this.hasReservation = reservations.some(r => r.event?.idEvent === Number(eventId)); // Ensure type match
        console.log('Has reservation:', this.hasReservation); // Debug
      },
      (error) => {
        console.error('Error checking reservations:', error);
      }
    );
  }

  showAddReservationForm() {
    if (this.hasReservation) {
      this.notification = 'You have already made a reservation for this event';
      setTimeout(() => this.notification = null, 3000);
    } else {
      this.showAddForm = true;
    }
  }

  onReservationAdded() {
    this.showAddForm = false;
    this.hasReservation = true;
    if (this.event) {
      this.checkUserReservation(this.event.idEvent!);
    }
  }

  goToReservations() {
    this.router.navigate(['/events/user/reservations']);
  }
}
