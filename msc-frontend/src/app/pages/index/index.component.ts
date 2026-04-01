import {Component, Injector} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIconAnchor, MatIconButton} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon'
import {CoatOfArmsComponent} from '@app/components/coat-of-arms/coat-of-arms.component';
import {SmartComponent} from '@app/components/smart-component';
import {IAppState} from '@app/services/app.service';
import {Corps} from '@shared/types/corps';
import {NgIf} from '@angular/common';
import {Activities} from '@shared/types/activities';

@Component({
  selector: 'msc-index',
  imports: [
    CoatOfArmsComponent,
    MatIconModule,
    RouterLink,
    NgIf,
    MatIconAnchor
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent extends SmartComponent {
  public corpsList: Corps[] = [];
  public currentSemester: Activities.Semester = null;

  constructor() {
    super();
  }

  public afterDataChange(state: IAppState) {
    this.currentSemester = state.currentSemester;
    this.corpsList = state.corpsBase.filter(x => x.name !== "admins");
  }

  public getCurrentYear(): string {
    return new Date().getFullYear().toString();
  }

  public getCorps(corpsId: string): Corps {
    return this.corpsList.find(x => x._id === corpsId);
  }
}
