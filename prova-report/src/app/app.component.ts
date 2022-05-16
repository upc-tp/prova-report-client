import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './common/auth/auth.service';
import { User } from './interfaces/users';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';


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
    private authService: AuthService,
    private _sanitizer: DomSanitizer,
    private iconRegistry: MatIconRegistry
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
    this.iconRegistry.addSvgIcon(
      'ProvaIcon',
      this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/LogoProvaReport.svg')
    );
  }

  logout() {
    this.authService.logout().subscribe(res => {
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['/login']);
    });
  }
}
