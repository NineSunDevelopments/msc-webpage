import {Component, Injector} from '@angular/core';
import {MatTabBody, MatTabsModule} from '@angular/material/tabs';
import {MatAnchor} from '@angular/material/button';
import {Activities} from '@shared/types/activities';
import {SmartComponent} from '@app/components/smart-component';
import {IAppState} from '@app/services/app/app.service';
import {DateTime} from 'luxon';
import {NgForOf, NgTemplateOutlet} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {SemesterSettingsService} from '@app/services/activities/semester-settings/semester-settings.service';
import {MatInput} from '@angular/material/input';
import Semester = Activities.Semester;
import {CorpsSelectorComponent} from '@app/components/corps-selector/corps-selector.component';

@Component({
  selector: 'msc-administration',
  imports: [
    MatTabsModule,
    MatTabBody,
    MatExpansionModule,
    MatTableModule,
    FormsModule,
    MatFormFieldModule,
    MatAnchor,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    NgTemplateOutlet,
    NgForOf,
    MatInput,
    CorpsSelectorComponent,
  ],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.scss'
})
export class AdministrationComponent extends SmartComponent {
  public pastSemester: Semester[] = [];
  public nextSemester: Semester = null;
  public currentSemester: Semester = null;

  constructor(
    injector: Injector,
    private semesterSettingsService: SemesterSettingsService,
  ) {
    super(injector);

    this.semesterSettingsService.load();
  }

  public afterDataChange(state: IAppState) {
    this.pastSemester = [];
    this.currentSemester = null;
    this.nextSemester = null;

    state.semesterBase.forEach(semester => {
      if (semester.end < DateTime.now())
        this.pastSemester.push(semester);
      else if (semester.start > DateTime.now())
        this.nextSemester = semester;
      else
        this.currentSemester = semester;
    });

    if (this.currentSemester === null) {
      const start = DateTime.fromObject({year: DateTime.now().year, month: 4, day: 1});
      const end = start.plus({months: 6});
      const name = (start.month < end.month ? 'SS ' + (start.year - 2000) : 'WS ' + (start.year - 2000) + '/' + (start.year - 2000 + 1));
      this.semesterSettingsService.insert({
        corpsId: state.user.corpsId,
        createdAt: DateTime.now(),
        deleted: false,
        end,
        name,
        notes: "",
        start,
        senior: {name: "", email: "", phone: ""},
        conSenior: {name: "", email: "", phone: ""},
        subSenior: {name: "", email: "", phone: ""},
        banker: {name: "", email: "", phone: ""},
        banking: {iban: "", bic: "", name: ""},
        updatedAt: DateTime.now()
      });
    }
  }

  public createSemester() {
    const start = this.currentSemester.end.plus({days: 1});
    const end = start.plus({months: 6});

    const name = (start.month < end.month ? 'SS ' + (start.year - 2000) : 'WS ' + (start.year - 2000) + '/' + (start.year - 2000 + 1));

    this.semesterSettingsService.insert({
      corpsId: null,
      createdAt: DateTime.now(),
      deleted: false,
      end,
      name,
      notes: "",
      start,
      senior: {name: "", email: "", phone: ""},
      conSenior: {name: "", email: "", phone: ""},
      subSenior: {name: "", email: "", phone: ""},
      banker: {name: "", email: "", phone: ""},
      banking: {iban: "", bic: "", name: ""},
      updatedAt: DateTime.now()
    }).then(() => this.semesterSettingsService.load());
  }

  public addHonorableJudge(semester: Activities.Semester) {
    semester.honorableJudges.push({address: "", email: "", firstName: "", lastName: "", phone: ""});
  }

  public updateSemester(semester: Activities.Semester) {
    this.semesterSettingsService.update(semester).then(() => this.semesterSettingsService.load());
  }
}
