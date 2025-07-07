import {Component, Injector} from '@angular/core';
import {LoadingComponent} from "@app/components/loading/loading.component";
import {SmartComponent} from '@app/components/smart-component';
import {IAppState} from '@app/services/app/app.service';
import {ActivitiesService} from '@app/services/activities/activities/activities.service';
import {
  MatCell,
  MatCellDef,
  MatColumnDef, MatFooterCell, MatFooterCellDef, MatFooterRow, MatFooterRowDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {Activities} from '@shared/types/activities';
import {NgIf} from '@angular/common';
import {MatAnchor, MatMiniFabAnchor} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {DateTime} from 'luxon';
import {MatCheckbox} from '@angular/material/checkbox';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {Corps} from '@shared/types/corps';
import {CorpsSelectorComponent} from '@app/components/corps-selector/corps-selector.component';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';

interface Activity extends Activities.Activity{
  editMode: boolean;
}

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
  ],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.scss'
})
export class ActivitiesComponent extends SmartComponent {



  public columns: (keyof Activity | string)[] = [
    "date", "official", "public", "attendanceRequired", "name", "description", "corps", "location", "actions"
  ];
  public loading = true;

  public activities: Activity[] = [];

  constructor(
    injector: Injector,
    private activitiesService: ActivitiesService
  ) {
    super(injector);
  }

  public onInit(): void {
    this.activitiesService.load().then((data) => {
      this.activities = data.map((activity) => {
        const existing = this.activities.find(x => x._id === activity._id);
        return !existing?.editMode ? {...activity, editMode: false}: existing;
      });
      this.loading = false;
    });
  }

  public canEdit(activity: Activities.Activity = null): boolean {
    return this.appState.currentSemester.corpsId === this.appState.user.corpsId
      || (activity !== null && activity.corpsId === this.appState.user.corpsId)
  }

  public addActivity() {
    this.activities.push({
      attendanceRequired: false,
      corpsId: this.appState.user.corpsId,
      createdAt: DateTime.now(),
      date: DateTime.now(),
      deleted: false,
      description: "",
      location: "",
      name: "",
      official: false,
      public: false,
      updatedAt: DateTime.now(),
      editMode: true,
    });
    this.activities = [...this.activities];
  }

  public delete(element: Activity, index: number): void {
    this.activities.splice(index, 1);
    this.activities = [...this.activities];

    if (element._id)
      this.activitiesService.delete(element).then(() => this.onInit());
  }

  public async save(element: Activity) {
    element.editMode = false;

    if (element._id) {
      element.updatedAt = DateTime.now();
      await this.activitiesService.update(element);
    } else {
      element.createdAt = DateTime.now();
      element.updatedAt = DateTime.now();
      await this.activitiesService.insert(element);
    }

    this.onInit()
  }

  public getCorps(corpsId: string): Corps {
    return this.appState.corpsBase.find(x => x._id === corpsId);
  }
}
