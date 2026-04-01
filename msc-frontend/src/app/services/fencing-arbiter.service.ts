import {Injectable, Injector} from '@angular/core';
import {DataService} from '@app/services/data-service';
import {Fencing} from '@shared/types/fencing';

@Injectable({
  providedIn: 'root'
})
export class FencingArbiterService extends DataService<Fencing.Arbiter> {

  constructor(
    injector: Injector,
  ) {
    super({
      link: '/fencingArbiter',
      name: 'arbiter',
      injector
    });
  }
}
