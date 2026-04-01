import {Component, inject} from '@angular/core';
import {CorpsSelectorComponent} from "@app/components/corps-selector/corps-selector.component";
import {FormsModule} from "@angular/forms";
import {LoadingComponent} from "@app/components/loading/loading.component";
import {MatAnchor} from "@angular/material/button";
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
} from "@angular/material/table";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatIcon} from "@angular/material/icon";
import {NgIf} from "@angular/common";
import {Fencing} from '@shared/types/fencing';
import {SmartComponent} from '@app/components/smart-component';
import {IAppState} from '@app/services/app.service';
import {Corps} from '@shared/types/corps';
import {DateTime} from 'luxon';
import {MatFormField, MatInput} from '@angular/material/input';
import {CorpsService} from '@app/services/corps.service';
import {Judge as JudgeRaw} from '@shared/types/judge';
import {JudgeService} from '@app/services/judge.service';
import {RouterLink} from '@angular/router';

interface Judge extends JudgeRaw {
  editMode: boolean;
}

interface Doctor extends Fencing.Doctor {
  editMode: boolean;
}

@Component({
  selector: 'msc-fencing',
  imports: [
    FormsModule,
    LoadingComponent,
    MatAnchor,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFooterCell,
    MatFooterRow,
    MatFooterRowDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatRow,
    MatRowDef,
    MatTable,
    NgIf,
    MatHeaderCellDef,
    MatFooterCellDef,
    MatFormField,
    MatInput,
    RouterLink
  ],
  templateUrl: './judges.component.html',
  styleUrl: './judges.component.scss'
})
export class JudgesComponent extends SmartComponent {
  public judges: Judge[] = [];
  public judgeColumns: (keyof Judge | string)[] = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "address",
    "actions"
  ];

  public loading = true;

  private judgeService = inject(JudgeService);
  private corpsService = inject(CorpsService);

  constructor() {
    super();
  }

  public async onInit() {
    if (this.appState.corpsBase.length === 0)
      await this.corpsService.load();

    this.judges = (await this.judgeService.load())
      .map(x => ({...x, editMode: false}))
      .sort((a, b) => (a.lastName+a.firstName).localeCompare(b.lastName+b.firstName));

    this.loading = false;
  }

  public afterDataChange(state: IAppState) {
    state.judgeBase.forEach(x => {
      const existingIndex = this.judges.findIndex(y => x._id === y._id);

      if (existingIndex !== -1) {
        this.judges[existingIndex] = {...x, editMode: this.judges[existingIndex]?.editMode ?? false};
      } else {
        this.judges = [...this.judges, {...x, editMode: false}];
      }
    });
    this.judges.sort((a, b) => (a.lastName+a.firstName).localeCompare(b.lastName+b.firstName));

    this.loading = false;
  }

  public getCorps(corpsId: string): Corps {
    return this.appState.corpsBase.find(c => c._id === corpsId);
  }

  protected addJudge() {
    const now = DateTime.now();
    const newJudge = {
      _id: "TMP" + Math.random() * 99999999,
      createdAt: now,
      updatedAt: now,
      deleted: false,
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      editMode: true,
    };
    this.judges = [...this.judges, newJudge];
  }

  protected saveJudge(data: Judge) {
    const now = DateTime.now();
    data.editMode = false;

    if (data._id)
      this.judgeService.update({
        ...data,
        updatedAt: now
      }).then(() => {
        this.judgeService.load();
      });
    else {
      this.judges = this.judges.filter(a => a._id === data._id);
      this.judgeService.insert(data).then(() => {
        this.judgeService.load();
      });
    }
  }

  protected deleteJudge(data: Judge, i) {
    this.judges = this.judges.filter(a => a._id !== data._id);
    this.judgeService.delete(data).then(() => {
      this.judgeService.load();
    });
  }
}
