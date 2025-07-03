import {Component, Injector} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {SidebarComponent} from '@app/components/sidebar/sidebar.component';
import {SmartComponent} from '@app/components/smart-component';
import {NgIf} from '@angular/common';
import {MatFormField, MatInput, MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAnchor, MatButton} from '@angular/material/button';
import {AuthenticationService} from '@app/services/authentication/authentication.service';
import {IAppState} from '@app/services/app/app.service';
import {LoadingComponent} from '@app/components/loading/loading.component';

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
    MatButton,
    LoadingComponent,
  ],
  templateUrl: './intern.component.html',
  styleUrl: './intern.component.scss'
})
export class InternComponent extends SmartComponent {

  public loading: boolean = true;

  public loginForm = {
    email: null,
    password: null,
    passwordHidden: true
  }

  constructor(
    injector: Injector,
    private authService: AuthenticationService
  ) {
    super(injector);
  }

  public afterDataChange(state: IAppState) {
    this.loading = false;
  }

  public emptyOrNull(str: string): boolean {
    return str === null || str === undefined || str.trim() === '';
  }

  public login() {
    if (this.emptyOrNull(this.loginForm.email) || this.emptyOrNull(this.loginForm.password))
      return;

    this.loading = true;
    this.authService.login(this.loginForm.email, this.loginForm.password, true);
  }
}
