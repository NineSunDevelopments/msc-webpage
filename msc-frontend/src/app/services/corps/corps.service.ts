import {Injectable, Injector} from '@angular/core';
import {Corps} from '@shared/types/corps';
import {DataService} from '@app/services/data-service';

@Injectable({
  providedIn: 'root'
})
export class CorpsService extends DataService<Corps> {

  constructor(
    injector: Injector,
  ) {
    super({
      link: '/corps',
      injector,
    });
  }

  public isInCharge(corps: Corps): boolean {
    const currentSemester = this.appService.state.currentSemester;

    if (this.appService.state.user.isSuperAdmin)
      return true;

    if (!corps || !currentSemester)
      return false;

    return currentSemester.corpsId === corps._id || this.appService.state.user.isSuperAdmin;
  }
}
