import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { displayByEvent } from '../../../services/fn/registration-management/display-by-event';
import { Registration } from '../../../services/models';

@Component({
  selector: 'app-event-registrations',
  templateUrl: './event-registrations.component.html',
  styleUrls: ['./event-registrations.component.scss']
})
export class EventRegistrationsComponent implements OnInit {
  registrations: Registration[] = [];
  loading = true;
  error: string | null = null;
  eventId?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.eventId) {
      this.loadRegistrations(this.eventId);
    }
  }

  loadRegistrations(eventId: number): void {
    this.loading = true;
    displayByEvent(this.http, '/api', { eventId }).subscribe({
      next: (response) => {
        this.registrations = response.body || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load registrations';
        this.loading = false;
        console.error(err);
      }
    });
  }

  backToEvent(): void {
    this.router.navigate(['/admin/events']);
  }
}