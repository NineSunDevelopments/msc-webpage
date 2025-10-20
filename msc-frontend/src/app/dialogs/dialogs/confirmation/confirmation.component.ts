import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef as MatDialogRef } from '@angular/material/dialog';
import {DialogWrapperComponent} from '@dialogs/components/dialog-wrapper/dialog-wrapper.component';
import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';


@Component({
  selector: 'confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
  imports: [
    DialogWrapperComponent,
    MatButton,
    NgIf
  ]
})
export class ConfirmationComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      closeX: boolean,
      title: string,
      message: string,
      cancel: () => void,
      confirm?: () => void,
      confirmBtn?: string;
      cancelBtn?: string;
    },
  ) {
    data.closeX = data.closeX === undefined ? true : data.closeX;
  }

  @HostListener('window:keyup.esc')
  onCancel() {
    this.dialogRef.close();
    if (typeof this.data.cancel === 'function') {
      this.data.cancel();
    }
  }

  @HostListener('window:keyup.enter')
  onConfirm() {
    this.dialogRef.close();
    if (typeof this.data.confirm === 'function') {
      this.data.confirm();
    }
  }
}
