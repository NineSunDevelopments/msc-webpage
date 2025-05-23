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

}
