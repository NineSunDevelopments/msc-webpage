import {Component, Injector} from '@angular/core';
import {MatTabBody, MatTabsModule} from '@angular/material/tabs';
import {MatAnchor, MatButton, MatIconButton} from '@angular/material/button';
import {Activities} from '@shared/types/activities';
import {SmartComponent} from '@app/components/smart-component';
import {IAppState} from '@app/services/app/app.service';
import {DateTime} from 'luxon';
import {NgIf, NgTemplateOutlet} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {SemesterSettingsService} from '@app/services/activities/semester-settings/semester-settings.service';
import {MatInput} from '@angular/material/input';
import {CorpsSelectorComponent} from '@app/components/corps-selector/corps-selector.component';
import {Corps} from '@shared/types/corps';
import {User} from '@shared/types/user';
import {ConfirmationComponent} from '@dialogs/dialogs/confirmation/confirmation.component';
import {ConfirmationDialogConfig, DefaultDialogConfig} from '@dialogs/constants/dialog-configs';
import {UserService} from '@app/services/user/user.service';
import {AddCorpsAccountDialogComponent} from '@dialogs/dialogs/add-corps-account/add-corps-account.dialog.component';
import {ColorsComponent} from '@app/components/colors/colors.component';
import {MatCheckbox} from '@angular/material/checkbox';

@Component({
  selector: 'msc-administration',
  imports: [
    MatTabsModule,
    MatExpansionModule,
    MatTableModule,
    FormsModule,
    MatFormFieldModule,
    MatAnchor,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    NgTemplateOutlet,
    MatInput,
    CorpsSelectorComponent,
    MatButton,
    ColorsComponent,
  ],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.scss'
})
export class AdministrationComponent extends SmartComponent {
  public pastSemester:Activities.Semester[] = [];
  public nextSemester:Activities.Semester = null;
  public currentSemester:Activities.Semester = null;

  constructor(
    injector: Injector,
    private semesterSettingsService: SemesterSettingsService,
    private userService: UserService,
  ) {
    super(injector);

    this.semesterSettingsService.load();
  }

  public afterDataChange(state: IAppState) {
    this.pastSemester = [];
    this.currentSemester = null;
    this.nextSemester = null;

    state.semesterBase.forEach(semester => {
      semester.honorableJudges = semester.honorableJudges ?? [];
      semester.banker = {name: "", email: "", phone: "", ...semester.banker};
      semester.senior = {name: "", email: "", phone: "", ...semester.senior};
      semester.conSenior = {name: "", email: "", phone: "", ...semester.conSenior};
      semester.subSenior = {name: "", email: "", phone: "", ...semester.subSenior};
      semester.banking = {iban: "", bic: "", name: "", ...semester.banking};

      if (semester.end <= DateTime.now())
        this.pastSemester.push(semester);
      else if (semester.start >= DateTime.now())
        this.nextSemester = semester;
      else
        this.currentSemester = semester;
    });

    if (this.currentSemester === null) {
      const start = DateTime.now().month < 9
        ? DateTime.fromObject({year: DateTime.now().year, month: 4, day: 1})
        : DateTime.fromObject({year: DateTime.now().year, month: 10, day: 1});
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

  public getCorpsAccount(corps: Corps): User {
    return this.appState.userBase.find(x => {
      return x.corpsId == corps._id;
    });
  }

  public createCorpsAccount(corps: Corps, user?: User) {
    this.dialog.open(AddCorpsAccountDialogComponent, {
      ...DefaultDialogConfig,
      data: {
        corps,
        existingUser: user ? user : undefined,
      }
    });
  }

  public deleteCorpsAccount(user: User) {
    this.dialog.open(ConfirmationComponent, {
      ...ConfirmationDialogConfig,
      data: {
        message: "Sicher, dass Sie die Addresse '"+user.email+"' entfernen wollen?",
        confirm: () => {
          this.userService.delete(user).then(() => {})
        }
      }
    })
  }

  public resetPassword(corpsAccount: User) {
    this.dialog.open(ConfirmationComponent, {
      ...ConfirmationDialogConfig,
      data: {
        message: "Passwort für den Account '"+ corpsAccount.email +"' wirklich zurücksetzen?",
        confirm: () => {
          this.userService.resetPassword(corpsAccount).then();
        }
      }
    })
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
