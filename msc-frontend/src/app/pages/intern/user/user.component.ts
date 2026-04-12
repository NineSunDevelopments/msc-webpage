import {Component} from '@angular/core';
import {UserService} from '@app/services/user.service';
import {SmartComponent} from '@app/components/smart-component';
import {MatTableModule} from '@angular/material/table';
import {User} from '@shared/types/user';
import {NgIf} from '@angular/common';
import {MatAnchor, MatIconAnchor} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {LoadingComponent} from '@app/components/loading/loading.component';
import {MatFormField, MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {ColorsComponent} from '@app/components/colors/colors.component';
import {MatCheckbox} from '@angular/material/checkbox';
import {DateTime} from 'luxon';
import {Corps} from '@shared/types/corps';
import {CorpsSelectorComponent} from '@app/components/corps-selector/corps-selector.component';

interface RowUser extends User {
  editMode: boolean;
}

@Component({
  selector: 'msc-user',
  imports: [MatTableModule, MatAnchor, NgIf, MatIconModule, RouterLink, LoadingComponent, MatFormField, MatInputModule, MatFormField, FormsModule, ColorsComponent, MatCheckbox, MatIconAnchor, CorpsSelectorComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent extends SmartComponent {

  public displayedColumns: (keyof RowUser | string)[] = ['email', 'corpsId', 'isAdmin', 'isSuperAdmin', 'activated', 'actions'];
  public loading = true;
  public users: RowUser[] = [];

  constructor(
    private userService: UserService,
  ) {
    super();
  }

  public onInit(): void {
    this.userService.load().then((data) => {
      this.users = data.map((x) => ({...x, editMode: false}));
      this.loading = false;
    })
  }

  public async save(user: RowUser) {
    delete user.editMode;

    if (!user._id) {
      await this.userService.insert(user)
        .then(() => this.onInit())
    } else {
      await this.userService.update(user)
        .then(() => this.onInit())
    }
    if (this.appState.user._id === user._id) {
      this.appService.mutate({user}).then();
    }
  }

  public add() {
    const now = DateTime.now();
    this.users = [...this.users, {
      activated: true,
      createdAt: now,
      deleted: false,
      email: "",
      password: "",
      token: "",
      updatedAt: now,
      editMode: true,
    }];
  }

  public canEdit(): boolean {
    return this.appState.user.isSuperAdmin;
  }

  protected getCorps(corpsId: string): Corps {
    return this.appState.corpsBase.find(x => x._id === corpsId) ?? null;
  }

  protected delete(user: User) {
    this.userService.delete(user).then(() => this.onInit());
  }
}
