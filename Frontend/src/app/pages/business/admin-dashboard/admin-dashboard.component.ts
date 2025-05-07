import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Business } from 'src/app/services/models/business';
import { Subscription } from 'rxjs';

import { AuthenticationService, GestionDesBusinessService } from 'src/app/services/services';
import { BusinessNotificationService } from 'src/app/services/services/BusinessNotificationService.service';
import { TokenService } from 'src/app/services/token/token.service';
import { NotificationE } from 'src/app/services/models/notificationE';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="container mt-4">
      <h2>Admin Dashboard</h2>
      <h3>Pending Businesses</h3>
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let b of businesses">
              <td>{{ b.idBusiness }}</td>
              <td>{{ b.name }}</td>
              <td>{{ b.categorieBusiness }}</td>
              <td>{{ b.status || 'N/A' }}</td>
              <td>
                <button class="btn btn-success btn-sm me-2" (click)="approveBusiness(b.idBusiness!)" [disabled]="b.status !== 'PENDING'">Approve</button>
                <button class="btn btn-danger btn-sm" (click)="rejectBusiness(b.idBusiness!)" [disabled]="b.status !== 'PENDING'">Reject</button>
              </td>
            </tr>
            <tr *ngIf="businesses.length === 0">
              <td colspan="5" class="text-center">No pending businesses</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; }
    .me-2 { margin-right: 0.5rem; }
    .mt-4 { margin-top: 1.5rem; }
    .table-responsive { margin-bottom: 1rem; }
  `]
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  businesses: Business[] = [];
  private subscription = new Subscription();

  constructor(
    private businessService: GestionDesBusinessService,
    private notificationService: BusinessNotificationService,
    private authService: AuthenticationService,
    private tokenService: TokenService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPendingBusinesses();
    if (this.authService.isAuthenticated()) {
      this.notificationService.initializeWebSocket();
      this.subscription.add(
        this.notificationService.notifications$.subscribe(
          (notifications: NotificationE[]) => {
            const latestNotification = notifications[0]; // Most recent first
            if (latestNotification && latestNotification.business) {
              this.snackBar.open(
                `${latestNotification.message} (ID: ${latestNotification.business.idBusiness})`,
                'Fermer',
                {
                  duration: 5000,
                  panelClass: ['notification-snackbar'],
                  verticalPosition: 'top',
                  horizontalPosition: 'right'
                }
              );
            }
            console.log('Notifications received:', notifications);
          },
          error => console.error('Notification subscription error:', error)
        )
      );
    }
  }

  loadPendingBusinesses(): void {
    this.businessService.getAllBusiness().subscribe({
      next: (businesses) => {
        this.businesses = businesses.filter(b => b.status === 'PENDING');
        console.log('Pending businesses loaded:', this.businesses);
      },
      error: (e) => console.error('Error fetching businesses:', e)
    });
  }

  approveBusiness(id: number): void {
    this.businessService.approveBusiness({ id }).subscribe({
      next: () => {
        this.businesses = this.businesses.filter(b => b.idBusiness !== id);
        console.log(`Approved business ID: ${id}`);
        this.snackBar.open(`Business ID ${id} approved successfully!`, 'Fermer', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (e) => {
        console.error('Error approving:', e);
        this.snackBar.open('Error approving business.', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  rejectBusiness(id: number): void {
    this.businessService.rejectBusiness({ id }).subscribe({
      next: () => {
        this.businesses = this.businesses.filter(b => b.idBusiness !== id);
        console.log(`Rejected business ID: ${id}`);
        this.snackBar.open(`Business ID ${id} rejected successfully!`, 'Fermer', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (e) => {
        console.error('Error rejecting:', e);
        this.snackBar.open('Error rejecting business.', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    //this.notificationService.disconnectWebSocket();
  }
}