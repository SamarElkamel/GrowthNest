import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-role',
  templateUrl: './select-role.component.html',
  styleUrls: ['./select-role.component.scss']
})
export class SelectRoleComponent {
  roles: string[] = ['User', 'BuisnessOwner', 'MarketingAgent'];
  selectedRole: string = '';

  constructor(private router: Router) {}

  selectRole(role: string) {
    this.selectedRole = role;

    // Define a mapping for the roles to match the enum in backend
    const roleMap: { [key: string]: string } = {
      'User': 'USER',
      'BusinessOwner': 'BuisnessOwner',
      'MarketingAgent': 'MarketingAgent'
    };

    // Check if the selected role exists in the roleMap
    if (roleMap[role]) {
      // Save the formatted role (matching backend enum casing) in localStorage
      localStorage.setItem('selectedRole', roleMap[role]);

      // Navigate to the registration page
      this.router.navigate(['/register']);
    } else {
      console.error('Invalid role selected');
    }
  }
}
