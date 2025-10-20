import {Component, Injector} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AuthenticationService} from '@app/services/authentication/authentication.service';
import {SmartComponent} from '@app/components/smart-component';
import {CorpsService} from '@app/services/corps/corps.service';

@Component({
  selector: 'msc-sidebar',
  imports: [
    RouterLinkActive,
    RouterLink
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent extends SmartComponent {
  constructor(
    private authService: AuthenticationService,
    private corpsService: CorpsService,
    injector: Injector,
  ) {
    super(injector);
  }

  public logout() {
    this.authService.logout().then();
  }

  public isInCharge(): boolean {
    const corps = this.appService.state.corpsBase.find(x => this.appService.state.user.corpsId === x._id);
    return this.corpsService.isInCharge(corps);
  }
}
