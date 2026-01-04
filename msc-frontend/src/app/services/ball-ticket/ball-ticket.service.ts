import {Injectable, Injector} from '@angular/core';
import {Corps} from '@shared/types/corps';
import {DataService} from '@app/services/data-service';
import {BallTickets} from '@shared/types/ball-tickets';

@Injectable({
  providedIn: 'root'
})
export class BallTicketService extends DataService<BallTickets> {

  constructor(
    injector: Injector,
  ) {
    super({
      link: '/ballTickets',
      injector,
    });
  }

  public loadForCurrentSemester(): Promise<BallTickets[]> {
    return this.api.get<BallTickets[]>(this.dataLink + '/for-current-semester');
  }
}
