import {Injectable, Injector} from '@angular/core';
import {DataService} from '@app/services/data-service';
import {Report} from '@shared/types/report';
import {Corps} from '@shared/types/corps';
import {Activities} from '@shared/types/activities';

@Injectable({
  providedIn: 'root'
})
export class ReportSemesterService extends DataService<Report.Semester> {

  constructor(
    injector: Injector,
  ) {
    super({
      link: '/reportSemester',
      injector,
      skipLocalStorage: true
    });
  }

  public loadForCorps(corps: Corps): Promise<Report.Semester[]> {
    return this.api.get<Report.Semester[]>(this.dataLink + '/for-corps/' + corps._id);
  }

  public loadForSemester(semester: Activities.Semester): Promise<Report.Semester[]> {
    return this.api.get<Report.Semester[]>(this.dataLink + '/for-semester/' + semester._id);
  }
}
