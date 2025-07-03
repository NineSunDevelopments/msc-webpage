import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AuthenticationService} from '@app/services/authentication/authentication.service';

@Component({
  selector: 'msc-sidebar',
  imports: [
    RouterLinkActive,
    RouterLink
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  constructor(
    private authService: AuthenticationService
  ) {}

  public logout() {
    this.authService.logout().then();
  }
}
