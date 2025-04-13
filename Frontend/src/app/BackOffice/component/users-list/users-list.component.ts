import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/services/models';
import { UserManagementService } from 'src/app/services/services';

@Component({
  selector: 'app-user-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = []; 
  usersInitiaux: User[] = []; 
  displayedUsers: User[] = []; 

  roles = [
    { name: 'USER' },
    { name: 'BuisnessOwner' },
    { name: 'MarketingAgent' },
  ]; 

  query: string = '';
  itemsPerPage: number = 3; 
  totalPages: number = 1; 
  currentPage: number = 1; 
  pages: number[] = []; 

  selectedUserState: string = '';
  selectedAccountState: string = '';
  selectedRole: string = '';

  constructor(private userService: UserManagementService) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        console.log('Received data:', data); 
        if (data && data.length) {
          const filtered = data.filter(user => user.email.toLowerCase() !== 'admin@gmail.com');
          this.users = filtered; 
          this.usersInitiaux = data; 
          this.paginate(); 
        } else {
          console.error("No users found in the response.");
        }
      },
      error: (err) => {
        console.error("Error fetching users:", err);
      }
    });
  }

  paginate(): void {
    this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.displayedUsers = this.getUsersForPage(this.currentPage);
  }

  getUsersForPage(page: number): User[] {
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.users.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.displayedUsers = this.getUsersForPage(page); 
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.displayedUsers = this.getUsersForPage(this.currentPage);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.displayedUsers = this.getUsersForPage(this.currentPage);
    }
  }

  onInputChange(): void {
    if (this.query === '') {
      this.users = this.usersInitiaux;
      this.paginate();
    } else {
      this.users = this.usersInitiaux.filter(user => 
        user.firstname.toLowerCase().includes(this.query.toLowerCase()) || 
        user.email.toLowerCase().includes(this.query.toLowerCase())
      );
      this.paginate(); 
    }
  }

  onFilterChange(): void {
    let filteredUsers = this.usersInitiaux;


    if (this.selectedUserState) {
      filteredUsers = filteredUsers.filter(user => 
        user.enabled === (this.selectedUserState === 'enabled')
      );
    }

 
    if (this.selectedAccountState) {
      filteredUsers = filteredUsers.filter(user => 
        user.accountLocked === (this.selectedAccountState === 'locked')
      );
    }


    if (this.selectedRole) {
      filteredUsers = filteredUsers.filter(user => 
        user.role?.name === this.selectedRole
      );
    }

    this.users = filteredUsers;
    this.paginate();
  }

  toggleLock(user: User): void {
  if (user.id == null) {
    console.error('User ID is undefined');
    return;
  }

  const newStatus = !user.accountLocked;

  this.userService.toggleAccountLock(user.id, newStatus).subscribe({
    next: () => {
      user.accountLocked = newStatus;
    },
    error: (err) => {
      console.error('Error updating account lock state:', err);
    }
  });
}

}
