import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  newUser = { name: '', email: '', password: '' }; // Para crear un nuevo usuario

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  addUser(): void {
    this.userService.addUser(this.newUser).subscribe(user => {
      this.users.push(user);
      this.newUser = { name: '', email: '', password: '' }; // Reiniciar el formulario
    });
  }
}
