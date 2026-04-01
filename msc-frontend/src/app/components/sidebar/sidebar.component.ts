import {Component, Injector} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AuthenticationService} from '@app/services/authentication.service';
import {SmartComponent} from '@app/components/smart-component';
import {CorpsService} from '@app/services/corps.service';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'msc-sidebar',
  imports: [
    RouterLinkActive,
    RouterLink,
    MatIcon
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent extends SmartComponent {
  constructor(
    private authService: AuthenticationService,
  ) {
    super();
  }

  public logout() {
    this.authService.logout().then();
  }
}
