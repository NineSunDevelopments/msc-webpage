import {Injectable, Injector} from '@angular/core';
import {DataService} from '@app/services/data-service';
import {Judge} from '@shared/types/judge';

@Injectable({
  providedIn: 'root'
})
export class JudgeService extends DataService<Judge> {

  constructor(
    injector: Injector,
  ) {
    super({
      link: '/judge',
      injector
    });
  }
}
