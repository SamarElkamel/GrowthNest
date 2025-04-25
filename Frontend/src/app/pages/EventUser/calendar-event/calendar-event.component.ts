import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { LocalTime, Registration } from 'src/app/services/models';
import { RegistrationManagementService } from 'src/app/services/services';
import { TokenService } from 'src/app/services/token/token.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar-event.component.html',
  styleUrls: ['./calendar-event.component.scss']
})
export class CalendarEventComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [],
    eventClick: this.handleEventClick.bind(this),
    plugins: [dayGridPlugin]
  };

  isLoading = false;
  error: string | null = null;
  userId!: number; // You'll need to set this from your token service

  constructor(
    private registrationService: RegistrationManagementService,
    private tokenService: TokenService
  ) {
  }

  ngOnInit(): void {
    this.userId = Number(this.tokenService.getUserId());
    this.loadConfirmedEvents();
  }

  loadConfirmedEvents(): void {
    console.log('Starting to load confirmed events...');
    this.isLoading = true;
    this.error = null;

    this.registrationService.getUserReservations({ userId: this.userId }).subscribe(
      (registrations: Registration[]) => {
        console.log('Successfully received registrations:', registrations);

        const confirmedRegistrations = registrations.filter(reg => reg.status === 'CONFIRMED' && reg.event);
        console.log(`Filtered ${confirmedRegistrations.length} CONFIRMED registrations out of ${registrations.length} total`);

        const calendarEvents = confirmedRegistrations.map(reg => this.mapRegistrationToEvent(reg));
        console.log('Mapped to calendar events:', calendarEvents);

        this.calendarOptions.events = calendarEvents;
        console.log('Calendar events updated successfully');

        this.isLoading = false;
        console.log('Loading completed');
      },
      error => {
        console.error('Error loading confirmed events:', error);
        this.error = 'Failed to load confirmed events';
        this.isLoading = false;
        console.log('Loading failed');
      }
    );
  }

  private mapRegistrationToEvent(registration: Registration): EventInput {
    const event = registration.event!;

    // Safely combine date with time for start and end
    const startDateTime = event.date ? this.combineDateAndTime(event.date, event.startTime) : '';
    const endDateTime = event.date ? this.combineDateAndTime(event.date, event.endTime) : '';

    // Fallback to all-day event if times are not available
    const allDay = !event.startTime || !event.endTime;

    return {
      id: event.idEvent?.toString(),
      title: event.title || 'No title',
      start: startDateTime || event.date, // Fallback to date-only if time is missing
      end: endDateTime || event.date,    // Fallback to date-only if time is missing
      allDay: allDay,                    // Mark as all-day event if times are missing
      extendedProps: {
        description: event.description,
        location: event.location,
        status: event.status,
        registrationStatus: registration.status,
        numberOfPlaces: event.numberOfPlaces
      },
      color: this.getEventColor(event.status)
    };
  }

  private combineDateAndTime(dateStr: string, time?: LocalTime): string {
    if (!time) return dateStr; // Return date only if no time specified

    // Safely handle optional time properties with defaults
    const hour = time.hour ?? 0;
    const minute = time.minute ?? 0;
    const second = time.second ?? 0;

    // Format time components to two digits
    const pad = (num: number) => num.toString().padStart(2, '0');
    const timeStr = `${pad(hour)}:${pad(minute)}:${pad(second)}`;

    return `${dateStr}T${timeStr}`;
  }

  private getEventColor(status: string | undefined): string {
    switch (status) {
      case 'PLANNED': return '#3788d8'; // Blue
      case 'ONGOING': return '#ffb143'; // Orange
      case 'COMPLETED': return '#5cb85c'; // Green
      case 'CANCELED': return '#d9534f'; // Red
      default: return '#3788d8'; // Default blue
    }
  }

  handleEventClick(clickInfo: any): void {
    try {
      if (!clickInfo?.event) {
        console.error('Invalid click info - no event found');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Could not retrieve event details'
        });
        return;
      }

      const event = clickInfo.event;
      const extendedProps = event.extendedProps || {};


      Swal.fire({
        title: event.title || 'Event Details',
        html: `
          <div style="text-align: left;">
            <p><strong>Status:</strong> ${extendedProps.status || 'Unknown'}</p>
            <p><strong>Your Registration:</strong> ${extendedProps.registrationStatus || 'Unknown'}</p>
            <p><strong>Where:</strong> ${extendedProps.location || 'Not specified'}</p>
            <p><strong>Description:</strong> ${extendedProps.description || 'No description'}</p>
            <p><strong>Available places:</strong> ${extendedProps.numberOfPlaces || 'Not specified'}</p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
        width: '600px'
      });

    } catch (error) {
      console.error('Error handling event click:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while displaying event details'
      });
    }
  }

  handleDateClick(arg: any): void {
    alert('Date clicked: ' + arg.dateStr);
  }
}