import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

 // constructor() { }

 set token(token: string) {
  console.log('Saving token to localStorage:', token); 
  localStorage.setItem('token', token);
}


  get token() {
    return localStorage.getItem('token') as string;
  }

  clearToken() {
    localStorage.removeItem('token');
  }


    getToken(): string | null {
      return localStorage.getItem('token');
    }

  getUserId(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.userId || null;  
    }
    return null;
  }
  
}
