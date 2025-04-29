import { Injectable } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class DateUtilsService {
  getTimeAgo(date: string): string {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  }
}