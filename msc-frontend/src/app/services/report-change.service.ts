import {Injectable, Injector} from '@angular/core';
import {DataService} from '@app/services/data-service';
import {Report} from '@shared/types/report';
import {Corps} from '@shared/types/corps';
import {Activities} from '@shared/types/activities';

@Injectable({
  providedIn: 'root'
})
export class ReportChangeService extends DataService<Report.Change> {

  constructor(
    injector: Injector,
  ) {
    super({
      link: '/reportChange',
      injector,
      skipLocalStorage: true
    });
  }

  public loadForCorps(corps: Corps): Promise<Report.Change[]> {
    return this.api.get(this.dataLink + '/for-corps/' + corps._id);
  }

  public loadForSemester(semester: Activities.Semester): Promise<Report.Change[]> {
    return this.api.get(this.dataLink + '/for-semester/' + semester._id);
  }

  async loadForCorpsAndSemester(corps: Corps, semester: Activities.Semester): Promise<Report.Change[]> {
    return this.api.get(this.dataLink + '/for-corps/' + corps._id + '/for-semester/' + semester._id);
  }
}
