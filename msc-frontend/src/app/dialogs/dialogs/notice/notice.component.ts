import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef as MatDialogRef } from '@angular/material/dialog';
import { deepEqual } from '@shared/utils/deep-equals';
import {NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';
import {DialogWrapperComponent} from '@dialogs/components/dialog-wrapper/dialog-wrapper.component';


export enum NoticeType {
  Success = 0,
  Info = 1,
  Warning = 2,
  Error = 3,
}


@Component({
  selector: 'notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.scss'],
  imports: [
    NgSwitchDefault,
    NgSwitchCase,
    DialogWrapperComponent,
    NgSwitch
  ]
})
export class NoticeComponent {

  public NoticeType = NoticeType;

  public ttl = 5000;
  public type: NoticeType = NoticeType.Info;
  public current = 0;

  private pauseCountdown = false;

  constructor(
    public dialogRef: MatDialogRef<NoticeComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: {
      ttl: number,
      type: NoticeType,
      message: string,
    },
  ) {

    // Close all other notices with the same data, with small delay to prevent flickering effect
    this.dialog.openDialogs.map(dialog => {
      const dialogData = dialog.componentInstance.data;

      if (deepEqual(dialogData, data))
        dialog.close();
    })

    if (data.ttl !== undefined) {
      this.ttl = data.ttl;
    }

    if (data.type !== undefined) {
      this.type = data.type;
    }

    window.setTimeout(this.reduceTTl.bind(this), 50);
  }


  onMouseEnter() {
    this.pauseCountdown = true;
  }

  onMouseLeave() {
    this.pauseCountdown = false;
  }

  reduceTTl() {
    if (!this.pauseCountdown) {
      this.current += 50;
    }

    if (this.current >= this.ttl) {
      this.dialogRef.close();
    }

    window.setTimeout(this.reduceTTl.bind(this), 50);
  }
}
