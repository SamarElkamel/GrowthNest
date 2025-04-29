import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NotificationE } from 'src/app/services/models/notificationE';
import { DateUtilsService } from 'src/app/services/services/dateUtilsService.Service';


@Component({
  selector: 'app-business-notification-item',
  templateUrl: './business-notification-item.component.html',
  styleUrls: ['./business-notification-item.component.scss']
})
export class BusinessNotificationItemComponent {
  @Input() notification!: NotificationE;
  @Input() isAdmin: boolean = false;
  @Output() markAsRead = new EventEmitter<NotificationE>();
  @Output() approve = new EventEmitter<NotificationE>();
  @Output() reject = new EventEmitter<NotificationE>();

  constructor(private dateUtilsService: DateUtilsService) {}

  getTimeAgo(date: string): string {
    return this.dateUtilsService.getTimeAgo(date);
  }

  onMarkAsRead(): void {
    this.markAsRead.emit(this.notification);
  }

  onApprove(): void {
    this.approve.emit(this.notification);
  }

  onReject(): void {
    this.reject.emit(this.notification);
  }
}