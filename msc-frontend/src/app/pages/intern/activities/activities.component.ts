import {Component} from '@angular/core';
import {LoadingComponent} from "@app/components/loading/loading.component";
import {SmartComponent} from '@app/components/smart-component';
import {ActivitiesService} from '@app/services/activities.service';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatFooterCell,
  MatFooterCellDef,
  MatFooterRow,
  MatFooterRowDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import {Activities} from '@shared/types/activities';
import {NgIf} from '@angular/common';
import {MatAnchor} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {DateTime} from 'luxon';
import {MatCheckbox} from '@angular/material/checkbox';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {Corps} from '@shared/types/corps';
import {CorpsSelectorComponent} from '@app/components/corps-selector/corps-selector.component';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {RouterLink} from '@angular/router';
import {EditActivityDialogComponent} from '@dialogs/dialogs/add-activitiy/edit-activity-dialog.component';
import {DefaultDialogConfig} from '@dialogs/constants/dialog-configs';
import {IAppState} from '@app/services/app.service';
import Activity = Activities.Activity;

@Component({
  selector: 'msc-activities',
  imports: [
    LoadingComponent,
    MatTable,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatHeaderCellDef,
    NgIf,
    MatAnchor,
    MatIconModule,
    MatFooterRow,
    MatFooterRowDef,
    MatFooterCell,
    MatFooterCellDef,
    MatFormFieldModule,
    MatCheckbox,
    FormsModule,
    MatInput,
    CorpsSelectorComponent,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    RouterLink,
  ],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.scss'
})
export class ActivitiesComponent extends SmartComponent {

  public columns: (keyof Activity | string)[] = [
    "date", "official", "public", "attendanceRequired", "name", "corps", "location", "actions"
  ];
  public loading = true;

  public activities: Activity[] = [];

  constructor(
    private activitiesService: ActivitiesService
  ) {
    super();
  }

  public onInit(): void {
    this.activitiesService.load()
      .then((data) => {
      this.activities = data
        .filter(x => x.date <= DateTime.now().plus({ years: 1 }) && x.date >= DateTime.now().minus({ month: 1 }));
      this.loading = false;
    });
  }

  public canEdit(activity: Activities.Activity = null): boolean {
    return this.appState.user.isAdmin ||
      this.appState.user.isSuperAdmin ||
      (activity !== null && activity.corpsId === this.appState.user.corpsId)
  }

  public delete(element: Activity, index: number): void {
    this.activities.splice(index, 1);
    this.activities = [...this.activities];

    if (element._id)
      this.activitiesService.delete(element).then(() => this.onInit());
  }

  public getCorps(corpsId: string): Corps {
    return this.appState.corpsBase.find(x => x._id === corpsId);
  }

  public async add() {
    const corps = this.appState.corpsBase.find(x => x._id === this.appState.user.corpsId);
    this.dialog.open(EditActivityDialogComponent, {
      ...DefaultDialogConfig,
      data: {
        corps
      },
    }).afterClosed().subscribe(async (reload) => {
      if (reload === true)
        this.onInit();
    });
  }

  public async edit(activity: Activity) {
    const corps = this.appState.corpsBase.find(x => x._id === this.appState.user.corpsId);
    this.dialog.open(EditActivityDialogComponent, {
      ...DefaultDialogConfig,
      data: {
        corps,
        activity
      },
    }).afterClosed().subscribe(async (reload) => {
      if (reload === true)
        this.onInit();
    });
  }

  protected readonly DateTime = DateTime;
}
