import { Component, OnInit } from '@angular/core';
import { RegistrationManagementService } from '../../../services/services/registration-management.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface MostPopularEvent {
  title: string;
  registrationCount: number;
}

interface Statistics {
  totalRegistrations: number;
  confirmed: number;
  cancelled: number;
  pending: number;
  uniqueUsers: number;
  mostPopularEvent: MostPopularEvent;
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  statistics$!: Observable<Statistics>;

  constructor(private registrationService: RegistrationManagementService) {}

  ngOnInit(): void {
    this.statistics$ = this.registrationService.getStatistics().pipe(
      map((stats: { [key: string]: any }) => ({
        totalRegistrations: stats['totalRegistrations'] as number,
        confirmed: stats['confirmed'] as number,
        cancelled: stats['cancelled'] as number,
        pending: stats['pending'] as number,
        uniqueUsers: stats['uniqueUsers'] as number,
        mostPopularEvent: stats['mostPopularEvent'] as MostPopularEvent
      }))
    );
  }

  // Calculate percentage for progress bars
  getPercentage(value: number, total: number): number {
    return total > 0 ? (value / total) * 100 : 0;
  }
}