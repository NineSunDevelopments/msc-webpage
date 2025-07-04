import {Component, Injector} from '@angular/core';
import {LoadingComponent} from '@app/components/loading/loading.component';
import {SmartComponent} from '@app/components/smart-component';
import {IAppState} from '@app/services/app/app.service';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import {ReportSemesterService} from '@app/services/reports/semester/report-semester.service';
import {ReportChangeService} from '@app/services/reports/changes/report-change.service';
import {ReportFencingService} from '@app/services/reports/fencing/report-fencing.service';
import {DateTime} from 'luxon';
import {Activities} from '@shared/types/activities';
import {NgForOf, NgIf, NgTemplateOutlet} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {Report} from '@shared/types/report';
import {MatAnchor} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import MemberChangeType = Report.MemberChangeType;
import {Corps} from '@shared/types/corps';

interface ReportListEntry {
  type: string;
  semester: Activities.Semester;
  submitDate: DateTime;
}

@Component({
  selector: 'msc-reports',
  imports: [
    LoadingComponent,
    MatTabGroup,
    MatTab,
    MatExpansionModule,
    MatTableModule,
    FormsModule,
    MatFormFieldModule,
    MatInput,
    NgForOf,
    MatAnchor,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    NgTemplateOutlet,
    NgIf
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent extends SmartComponent {

  public MemberChangeType = MemberChangeType;

  public loading = true;
  public reports: ReportListEntry[] = [];
  public reportColumns: (keyof ReportListEntry | string)[] = ['type', 'semester', 'submitDate'];
  public openSemesterReports: Report.Semester[] = [];
  public openFencingReports: Report.Fencing[] = [];

  public semesterReports: Report.Semester[] = [];
  public fencingReports: Report.Fencing[] = [];
  public changes: Report.Change[] = [];
  public unsubmittedChanges: Report.Change[] = [];

  constructor(
    injector: Injector,
    private reportSemesterService: ReportSemesterService,
    private reportFencingService: ReportFencingService,
    private reportChangeService: ReportChangeService,
  ) {
    super(injector);
  }

  public async afterDataChange(state: IAppState) {
    if (!state.user?.corpsId)
      return;

    const corps = state.corpsBase.find(x => x._id === state.user.corpsId);
    if (!corps)
      return

    [this.semesterReports, this.fencingReports, this.changes] = await Promise.all([
      this.reportSemesterService.loadForCorps(corps),
      this.reportFencingService.loadForCorps(corps),
      this.reportChangeService.loadForCorps(corps)
    ]);

    if (this.semesterReports.length === 0) {
      this.semesterReports = [await this.reportSemesterService.insert({
        changes: [],
        conSenior: "",
        corpsId: corps._id,
        createdAt: DateTime.now(),
        deleted: false,
        dueDate: state.currentSemester.end,
        fuchsMajor: "",
        semesterId: state.currentSemester._id,
        senior: "",
        subSenior: "",
        submitDate: null,
        updatedAt: DateTime.now()
      })];
    }

    if (this.fencingReports.length === 0) {
      this.fencingReports = [await this.reportFencingService.insert({
        corpsId: state.user.corpsId,
        createdAt: DateTime.now(),
        deleted: false,
        dueDate: state.currentSemester.end,
        matches: [],
        notes: "",
        semesterId: state.currentSemester._id,
        submitDate: null,
        updatedAt: DateTime.now()
      })];
    }

    this.semesterReports.forEach(report => {
      report.changes = this.changes
        .filter(x => x.semesterId === report.semesterId)
        .map(x => x._id);

      if (report.submitDate)
        this.reports.push({
          semester: this.getSemester(report.semesterId),
          submitDate: report.submitDate ?? null,
          type: 'Corpsbestand'
        })
      else
        this.openSemesterReports.push(report);
    });

    this.fencingReports.forEach(report => {
      if (report.submitDate)
        this.reports.push({
          semester: this.getSemester(report.semesterId),
          submitDate: report.submitDate ?? null,
          type: 'Fechtfragebogen'
        })
      else
        this.openFencingReports.push(report);
    });

    this.loading = false;
  }

  public getSemester(semesterId: string): Activities.Semester {
    return this.appState.semesterBase.find(x => x._id === semesterId);
  }

  public addUnsubmittedChange() {
    this.unsubmittedChanges.push({
      corpsId: this.appState.user.corpsId,
      createdAt: DateTime.now(),
      date: DateTime.now(),
      deleted: false,
      name: "",
      semesterId: this.appState.currentSemester._id,
      type: null,
      updatedAt: DateTime.now(),
    });
  }

  public getChange(changeId: string): Report.Change {
    return this.changes.find(x => x._id === changeId);
  }

  public async saveSemesterReport(report: Report.Semester) {
    const changes = await Promise.all(
      this.unsubmittedChanges.map(change => this.reportChangeService.insert(change))
    )

    report.updatedAt = DateTime.now();
    report.changes = changes.map(x => x._id);
    this.reportSemesterService.update(report).then();
  }

  public submitSemesterReport(report: Report.Semester) {
    report.submitDate = DateTime.now();
    this.saveSemesterReport(report).then();
  }

  public saveFencingReport(report: Report.Fencing) {
    report.updatedAt = DateTime.now();
    this.reportFencingService.update(report).then();
  }

  public submitFencingReport(report: Report.Fencing) {
    report.submitDate = DateTime.now();
    this.saveFencingReport(report);
  }

  public addMatch(report: Report.Fencing) {
    report.matches.push({
      partyA: {
        level: '1',
        corps: this.getCorps(this.appState.user.corpsId).name,
        paukant: '',
        sekundant: '',
      },
      partyB: {
        level: '1',
        corps: 'B! Frittonia zu Berlin',
        paukant: '',
        sekundant: '',
      }
    })
  }

  private getCorps(corpsId: string): Corps {
    return this.appState.corpsBase.find(x => x._id === corpsId);
  }
}
