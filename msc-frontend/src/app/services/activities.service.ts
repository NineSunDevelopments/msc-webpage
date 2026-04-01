import {Injectable, Injector} from '@angular/core';
import {DataService} from '@app/services/data-service';
import {Activities} from '@shared/types/activities';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService extends DataService<Activities.Activity> {

  constructor(
    injector: Injector,
  ) {
    super({
      link: '/activitiesActivity',
      injector,
    });
  }

  public loadForSemester(semester: Activities.Semester): Promise<Activities.Activity[]> {
    return new Promise<Activities.Activity[]>((resolve, reject) => {
      this.api.get<Activities.Activity[]>(this.dataLink + '/current')
        .then((result: Activities.Activity[]) => {
          this.appService.mutate({activities: result});
          resolve(result);
        })
        .catch((error: any) => reject(error));
    });
  }

}
