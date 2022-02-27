import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './common/auth/auth.service';
import { User } from './interfaces/users';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isCollapsed = false;
  currentUser: User;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.authService.currentUser.subscribe(u => {
      this.currentUser = u;
    });
    this.authService.logoutSubject.subscribe(l => {
      if (l) {
        this.logout();
        this.authService.logoutSubject.next(false);
      }
    })
  }

  logout() {
    this.authService.logout().subscribe(res => {
      this.router.navigate(['/login']);
    });
  }
}
