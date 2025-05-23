import { Component, Input } from '@angular/core';
import { MatDialogRef as MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'close',
  templateUrl: './close.component.html',
  styleUrls: [ './close.component.scss' ],
})
export class CloseComponent {

  @Input() dialogRef: MatDialogRef<any>;

  constructor() {
  }

  public onClick() {
    this.dialogRef.close();
  }

}
