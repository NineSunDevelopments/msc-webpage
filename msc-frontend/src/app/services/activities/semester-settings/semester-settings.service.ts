import {Injectable, Injector} from '@angular/core';
import {DataService} from '@app/services/data-service';
import {Activities} from '@shared/types/activities';

@Injectable({
  providedIn: 'root'
})
export class SemesterSettingsService extends DataService<Activities.Semester> {

  constructor(
    injector: Injector,
  ) {
    super({
      link: '/activitiesSemester',
      name: 'semester',
      injector,
    });
  }

  public loadCurrent(): Promise<Activities.Semester> {
    return new Promise<Activities.Semester>((resolve, reject) => {
      this.api.get<Activities.Semester>(this.dataLink + '/current')
        .then((result: Activities.Semester) => {
          this.appService.mutate({currentSemester: result});
          resolve(result);
        })
        .catch((error: any) => reject(error));
    });
  }

}
