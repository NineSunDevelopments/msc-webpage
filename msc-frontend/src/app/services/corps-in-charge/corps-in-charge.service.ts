import {Injectable, Injector} from '@angular/core';
import {DataService} from '@app/services/data-service';
import {MSCSettings} from '@shared/types/MSCSettings';

@Injectable({
  providedIn: 'root'
})
export class CorpsInChargeService extends DataService<MSCSettings.CorpsInCharge> {

  constructor(
    injector: Injector,
  ) {
    super({
      link: '/corps-in-charge',
      injector,
    });
  }

  public getCurrent(): Promise<MSCSettings.CorpsInCharge> {
    return new Promise<MSCSettings.CorpsInCharge>((resolve, reject) => {
      this.api.get<MSCSettings.CorpsInCharge>(this.dataLink + "/current")
        .then((result: MSCSettings.CorpsInCharge) => {
          resolve(this.mutateSingle(result));
        })
        .catch((error: any) => reject(error));
    });
  }

}
