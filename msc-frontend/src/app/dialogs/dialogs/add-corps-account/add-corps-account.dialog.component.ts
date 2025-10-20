import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef as MatDialogRef } from '@angular/material/dialog';
import {DialogWrapperComponent} from '@dialogs/components/dialog-wrapper/dialog-wrapper.component';
import {MatButton} from '@angular/material/button';
import {Corps} from '@shared/types/corps';
import {MatFormField, MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {User} from '@shared/types/user';
import {DateTime} from 'luxon';
import {UserService} from '@app/services/user/user.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {CorpsService} from '@app/services/corps/corps.service';
import {NgIf} from '@angular/common';


@Component({
  selector: 'add-corps-account-dialog',
  templateUrl: './add-corps-account.dialog.component.html',
  styleUrls: ['./add-corps-account.dialog.component.scss'],
  imports: [
    DialogWrapperComponent,
    MatButton,
    MatInput,
    FormsModule,
    MatFormFieldModule,
    NgIf,
  ]
})
export class AddCorpsAccountDialogComponent {

  public newAccount: User = null;

  constructor(
    public dialogRef: MatDialogRef<AddCorpsAccountDialogComponent>,
    private corpsService: CorpsService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: {
      corps: Corps
    },
  ) {

    if (data.corps) {
      this.newAccount = {
        email: null,
        password: null,
        corpsId: data.corps._id,
        activated: true,
        isSuperAdmin: false,
        token: null,
        deleted: false,
        createdAt: null,
        updatedAt: null,
      }
    }
  }

  @HostListener('window:keyup.esc')
  onCancel() {
    this.dialogRef.close();
  }

  @HostListener('window:keyup.enter')
  onConfirm() {
    this.userService.createNewCorpsAccount(this.newAccount).then(async () => {
      await this.corpsService.load();
      await this.userService.load();
      this.dialogRef.close()
    });
  }
}
