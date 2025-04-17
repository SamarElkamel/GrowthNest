import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  // Save token and role to localStorage
  set token(token: string | null) {
    console.log('Saving token to localStorage:', token);
    if (token) {
      localStorage.setItem('token', token);

      // Decode the token and save the role to localStorage
      const decodedToken: any = jwtDecode(token);
      if (decodedToken.authorities && decodedToken.authorities.length > 0) {
        const role = decodedToken.authorities[0]; // Assuming the role is the first item
        localStorage.setItem('role', role); // Save the role in localStorage
      }
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }
  }

  // Get token from localStorage
  get token(): string | null {
    return localStorage.getItem('token');
  }

  // Clear token and role from localStorage
  clearToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  // Get the user ID from the token
  getUserId(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.userId || null;
    }
    return null;
  }

  // Get the user role from the token
  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);  // Log the decoded token to inspect
        if (decodedToken.authorities && Array.isArray(decodedToken.authorities)) {
          console.log('User Authorities:', decodedToken.authorities);  // Log authorities array
          return decodedToken.authorities[0] || null;  // Return the first authority directly
        } else {
          console.error('No authorities found in the decoded token');  // Log error if authorities are missing
        }
      } catch (error) {
        console.error('Error decoding token:', error);  // Log any errors during decoding
      }
    }
    return null;
  }

  // Helper method to get the token from localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
