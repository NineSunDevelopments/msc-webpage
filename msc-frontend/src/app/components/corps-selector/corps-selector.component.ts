import {Component, EventEmitter, Injector, Input, Output} from '@angular/core';
import {Corps} from '@shared/types/corps';
import {SmartComponent} from '@app/components/smart-component';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import {IAppState} from '@app/services/app/app.service';

@Component({
  selector: 'msc-corps-selector',
  imports: [
    MatSelectModule,
    NgForOf,
    FormsModule,
    NgIf,
  ],
  templateUrl: './corps-selector.component.html',
  styleUrl: './corps-selector.component.scss'
})
export class CorpsSelectorComponent extends SmartComponent {

  @Input() public label: string = "Corps";

  @Input() public corpsId: string = null;
  @Output() public corpsIdChange: EventEmitter<string> = new EventEmitter();

  @Input() public corps: Corps = null;
  @Output() public corpsChange: EventEmitter<Corps> = new EventEmitter();

  constructor(injector: Injector) {
    super(injector);
  }

  public afterDataChange(state: IAppState) {
    if (this.corps)
      this.corpsId = this.corps._id;

    this.corps = state.corpsBase.find(x => x._id === this.corpsId);
  }

  public selectCorps(event: Corps) {
    this.corps = event;
    this.corpsChange.emit(this.corps);
    this.corpsIdChange.emit(this.corps._id);
  }
}
