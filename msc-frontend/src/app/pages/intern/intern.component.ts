import {Component, Injector} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {SidebarComponent} from '@app/components/sidebar/sidebar.component';
import {SmartComponent} from '@app/components/smart-component';
import {NgIf} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAnchor, MatButton} from '@angular/material/button';
import {AuthenticationService} from '@app/services/authentication.service';
import {LoadingComponent} from '@app/components/loading/loading.component';
import {UserService} from '@app/services/user.service';

@Component({
  imports: [
    RouterOutlet,
    SidebarComponent,
    NgIf,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatAnchor,
    LoadingComponent,
    MatButton,
    ReactiveFormsModule,
  ],
  selector: 'msc-intern',
  styleUrl: './intern.component.scss',
  templateUrl: './intern.component.html'
})
export class InternComponent extends SmartComponent {

  public loading: boolean = true;
  public sidebarOpen: boolean = false;

  public loginForm = new FormGroup( {
    email: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
    passwordHidden: new FormControl(true)
  });

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
  ) {
    super();

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
    console.log("Login");
    console.log(this.loginForm.value);
    if (!this.loginForm.valid)
      return;

    this.loading = true;
    this.authService.login(this.loginForm.get('email').value, this.loginForm.get('password').value, true)
      .then(async (user) => {
        if (user) {
          await this.userService.load();
        }
      })
      .finally(() => {
        this.loginForm.get('email').setValue(null);
        this.loginForm.get('password').setValue(null);
        this.loginForm.get('passwordHidden').setValue(true);
        this.loading = false;
      });
  }
}
