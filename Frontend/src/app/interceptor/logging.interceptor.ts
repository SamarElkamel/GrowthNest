import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.body instanceof FormData) {
      console.log(`Request to ${req.url}: FormData contents:`);
      const formData: FormData = req.body;
      formData.forEach((value, key) => {
        console.log(`${key}: ${value instanceof File ? `${value.name} (type: ${value.type})` : value}`);
      });
    }
    return next.handle(req);
  }
}