import {Component, Injector} from '@angular/core';
import {LoadingComponent} from '@app/components/loading/loading.component';
import {SmartComponent} from '@app/components/smart-component';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import {ReportSemesterService} from '@app/services/reports/semester/report-semester.service';
import {ReportChangeService} from '@app/services/reports/changes/report-change.service';
import {ReportFencingService} from '@app/services/reports/fencing/report-fencing.service';
import {DateTime} from 'luxon';
import {Activities} from '@shared/types/activities';
import {NgIf, NgTemplateOutlet} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {Report} from '@shared/types/report';
import {MatAnchor} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {Corps} from '@shared/types/corps';
import MemberChangeType = Report.MemberChangeType;

interface ReportListEntry {
  type: string;
  semester: Activities.Semester;
  submitDate: DateTime;
  report: Report.Semester | Report.Fencing;
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
  public reportColumns: (keyof ReportListEntry | string)[] = ['type', 'semester', 'submitDate', 'actions'];
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

  public afterDataChange() {
    this.loadData().then();
  }

  public async loadData() {
    if (!this.appState.user?.corpsId)
      return;

    const corps = this.appState.corpsBase.find(x => x._id === this.appState.user.corpsId);
    if (!corps)
      return;

    this.semesterReports = [];
    this.fencingReports = [];
    this.changes = [];
    this.unsubmittedChanges = [];
    this.reports = [];
    this.openSemesterReports = [];
    this.openFencingReports = [];

    [this.semesterReports, this.fencingReports, this.changes] = await Promise.all([
      this.reportSemesterService.loadForCorps(corps),
      this.reportFencingService.loadForCorps(corps),
      this.reportChangeService.loadForCorps(corps)
    ]);

    const inserts: Promise<any>[] = [];

    if (this.semesterReports.length === 0) {
      this.appState.semesterBase.map(semester => {
        inserts.push(this.reportSemesterService.insert({
          changes: [],
          conSenior: "",
          corpsId: corps._id,
          createdAt: DateTime.now(),
          deleted: false,
          dueDate: semester.end,
          fuchsMajor: "",
          semesterId: semester._id,
          senior: "",
          subSenior: "",
          submitDate: null,
          updatedAt: DateTime.now(),
          corpsInventory: {
            f: 0,
            cb: 0,
            iaCb: 0,
            ck: 0,
            ah: 0,
            eb: 0,
          }
        }));
      })
    }

    if (this.fencingReports.length === 0) {
      this.appState.semesterBase.forEach(semester => {
        console.log("Insert")
        inserts.push(this.reportFencingService.insert({
          corpsId: this.appState.user.corpsId,
          createdAt: DateTime.now(),
          deleted: false,
          dueDate: semester.end,
          matches: [],
          notes: "",
          semesterId: semester._id,
          submitDate: null,
          updatedAt: DateTime.now()
        }));
      })
    }

    await Promise.all(inserts).then(async () =>
      [this.semesterReports, this.fencingReports, this.changes] = await Promise.all([
        this.reportSemesterService.loadForCorps(corps),
        this.reportFencingService.loadForCorps(corps),
        this.reportChangeService.loadForCorps(corps)
      ])
    );

    this.semesterReports.forEach(report => {
      report.changes = this.changes
        .filter(x => x.semesterId === report.semesterId)
        .map(x => x._id);

      if (report.submitDate)
        this.reports.push({
          semester: this.getSemester(report.semesterId),
          submitDate: report.submitDate ?? null,
          type: 'Corpsbestand',
          report
        })
      else
        this.openSemesterReports.push(report);
    });

    this.fencingReports.forEach(report => {
      if (report.submitDate)
        this.reports.push({
          semester: this.getSemester(report.semesterId),
          submitDate: report.submitDate ?? null,
          type: 'Fechtfragebogen',
          report
        })
      else
        this.openFencingReports.push(report);
    });

    this.reports = [...this.reports];
    this.loading = false;
  }

  public removeChange(change: Report.Change, report: Report.Semester) {
    this.reportChangeService.delete(change).then(() => {
      this.changes = this.changes.filter(x => x._id !== change._id);
    });
    report.changes = report.changes.filter(x => x !== change._id);
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
    this.loading = true;
    const changes = await Promise.all(
      this.unsubmittedChanges.map(change => this.reportChangeService.insert(change))
    )

    report.corpsInventory = {
      f: Math.max(0, report.corpsInventory.f),
      cb: Math.max(0, report.corpsInventory.cb),
      iaCb: Math.max(0, report.corpsInventory.iaCb),
      ck: Math.max(0, report.corpsInventory.ck),
      ah: Math.max(0, report.corpsInventory.ah),
      eb: Math.max(0, report.corpsInventory.eb),
    }

    report.updatedAt = DateTime.now();
    report.changes = changes.map(x => x._id);

    return this.reportSemesterService.update(report).then(() => this.loadData());
  }

  public submitSemesterReport(report: Report.Semester) {
    report.submitDate = DateTime.now();
    return this.saveSemesterReport(report);
  }

  public unSubmitSemesterReport(report: ReportListEntry) {
    report.report.submitDate = null;
    return this.saveSemesterReport(report.report as Report.Semester);
  }

  public saveFencingReport(report: Report.Fencing) {
    this.loading = true;
    report.updatedAt = DateTime.now();
    return this.reportFencingService.update(report).then(() => this.loadData());
  }

  public submitFencingReport(report: Report.Fencing) {
    report.submitDate = DateTime.now();
    return this.saveFencingReport(report).then();
  }

  public unSubmitFencingReport(report: ReportListEntry) {
    report.report.submitDate = null;
    return this.saveFencingReport(report.report as Report.Fencing).then();
  }

  public addMatch(report: Report.Fencing) {
    report.matches.push({
      partyA: {
        level: '',
        corps: this.getCorps(this.appState.user.corpsId).name,
        paukant: '',
        sekundant: '',
      },
      partyB: {
        level: '',
        corps: '',
        paukant: '',
        sekundant: '',
      }
    })
  }

  private getCorps(corpsId: string): Corps {
    return this.appState.corpsBase.find(x => x._id === corpsId);
  }
}
