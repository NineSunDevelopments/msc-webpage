import {Component, Injector} from '@angular/core';
import {CoatOfArmsComponent} from '@app/components/coat-of-arms/coat-of-arms.component';
import {SmartComponent} from '@app/components/smart-component';
import {IAppState} from '@app/services/app/app.service';
import {Corps} from '@shared/types/corps';
import {NgIf} from '@angular/common';
import {MSCSettings} from '@shared/types/MSCSettings';

@Component({
  selector: 'msc-index',
  imports: [
    CoatOfArmsComponent,
    NgIf
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent extends SmartComponent {
  public corpsList: Corps[] = [];
  public corpsInCharge: MSCSettings.CorpsInCharge = null;

  constructor(injector: Injector) {
    super(injector);
  }

  public afterDataChange(state: IAppState) {
    console.log(state);
    this.corpsInCharge = state.corpsInCharge;
    this.corpsList = state.corpsBase;
  }

  public getCurrentYear(): string {
    return new Date().getFullYear().toString();
  }

  public getCorps(corpsId: string): Corps {
    return this.corpsList.find(x => x._id === corpsId);
  }
}
