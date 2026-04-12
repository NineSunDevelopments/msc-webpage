import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef as MatDialogRef } from '@angular/material/dialog';
import {DialogWrapperComponent} from '@dialogs/components/dialog-wrapper/dialog-wrapper.component';
import {MatButton} from '@angular/material/button';
import {Corps} from '@shared/types/corps';
import {MatFormField, MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {User} from '@shared/types/user';
import {DateTime} from 'luxon';
import {UserService} from '@app/services/user.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {CorpsService} from '@app/services/corps.service';
import {NgIf} from '@angular/common';
import {Activities} from '@shared/types/activities';
import Activity = Activities.Activity;
import {ActivitiesService} from '@app/services/activities.service';
import {MatCheckbox} from '@angular/material/checkbox';
import {CorpsSelectorComponent} from '@app/components/corps-selector/corps-selector.component';
import _ from 'lodash';
import {MatTimepicker, MatTimepickerInput, MatTimepickerToggle} from '@angular/material/timepicker';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';


@Component({
  selector: 'edit-activity-dialog',
  templateUrl: './edit-activity-dialog.component.html',
  styleUrls: ['./edit-activity-dialog.component.scss'],
  imports: [
    DialogWrapperComponent,
    MatButton,
    MatInput,
    FormsModule,
    MatFormFieldModule,
    MatCheckbox,
    CorpsSelectorComponent,
    MatTimepickerToggle,
    MatTimepicker,
    MatTimepickerInput,
    MatDatepickerInput,
    MatDatepicker,
    MatDatepickerToggle,
  ]
})
export class EditActivityDialogComponent {

  public activity: Activity = null;

  constructor(
    public dialogRef: MatDialogRef<EditActivityDialogComponent>,
    private activitiesService: ActivitiesService,
    @Inject(MAT_DIALOG_DATA) public data: {
      corps?: Corps,
      activity?: Activity
    },
  ) {
    const now = DateTime.now();
    this.activity = data.activity ? _.cloneDeep(data.activity) : {
      corpsId: data.corps?._id ?? null,
      name: "MSC Veranstaltung",
      date: DateTime.now().plus({days: 14}),
      location: data.corps?.name ? "adH " + data.corps.name : "Unbekannt",
      official: false,
      public: false,
      attendanceRequired: false,
      description: "",
      deleted: false,
      createdAt: now,
      updatedAt: now,
    };
  }

  @HostListener('window:keyup.esc')
  onCancel() {
    this.dialogRef.close(false);
  }

  @HostListener('window:keyup.enter')
  onConfirm() {
    if (this.activity._id)
      this.activitiesService.update(this.activity).then(async () => {
        this.dialogRef.close(true)
      });
    else
      this.activitiesService.insert(this.activity).then(async () => {
        this.dialogRef.close(true)
      });
  }
}
