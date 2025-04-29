import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  success(message: string, title: string = 'Success') {
    return Swal.fire({
      icon: 'success',
      title,
      text: message,
      confirmButtonColor: '#3085d6'
    });
  }

  error(message: string, title: string = 'Error') {
    Swal.fire({
      icon: 'error',
      title,
      text: message,
      confirmButtonColor: '#d33'
    });
  }

  info(message: string, title: string = 'Info') {
    Swal.fire({
      icon: 'info',
      title,
      text: message
    });
  }

  confirm(message: string, title: string = 'Are you sure?') {
    return Swal.fire({
      title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    });
  }
}
