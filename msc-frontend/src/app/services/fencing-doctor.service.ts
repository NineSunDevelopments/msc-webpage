import {Injectable, Injector} from '@angular/core';
import {DataService} from '@app/services/data-service';
import {Fencing} from '@shared/types/fencing';

@Injectable({
  providedIn: 'root'
})
export class FencingDoctorService extends DataService<Fencing.Doctor> {

  constructor(
    injector: Injector,
  ) {
    super({
      link: '/fencingDoctor',
      name: 'doctor',
      injector
    });
  }
}
