import {Component, Injector} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {SidebarComponent} from '@app/components/sidebar/sidebar.component';
import {SmartComponent} from '@app/components/smart-component';
import {NgIf} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAnchor} from '@angular/material/button';
import {AuthenticationService} from '@app/services/authentication/authentication.service';
import {LoadingComponent} from '@app/components/loading/loading.component';
import {UserService} from '@app/services/user/user.service';

@Component({
  selector: 'msc-intern',
  imports: [
    RouterOutlet,
    SidebarComponent,
    NgIf,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatIconModule,
    MatAnchor,
    LoadingComponent,
  ],
  templateUrl: './intern.component.html',
  styleUrl: './intern.component.scss'
})
export class InternComponent extends SmartComponent {

  public loading: boolean = true;
  public sidebarOpen: boolean = false;

  public loginForm = {
    email: null,
    password: null,
    passwordHidden: true
  }

  constructor(
    injector: Injector,
    private authService: AuthenticationService,
    private userService: UserService,
  ) {
    super(injector);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.sidebarOpen = true;

        const viewport = document.querySelector("body").getBoundingClientRect();
        if (viewport.width < 768) {
          this.sidebarOpen = false;
        }
      }
    });
  }

  public async afterDataChange(state: any) {
    if (this.appState.user) {
      await this.userService.load();
    }
    this.loading = false;
  }

  public emptyOrNull(str: string): boolean {
    return str === null || str === undefined || str.trim() === '';
  }

  public toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  public login() {
    if (this.emptyOrNull(this.loginForm.email) || this.emptyOrNull(this.loginForm.password))
      return;

    this.loading = true;
    this.authService.login(this.loginForm.email, this.loginForm.password, true)
      .then(async (user) => {
        if (user) {
          await this.userService.load();
        }
      })
      .finally(() => {
        this.loginForm.email = null;
        this.loginForm.password = null;
        this.loading = false;
      });
  }
}
