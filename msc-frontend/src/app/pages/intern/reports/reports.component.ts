import { Component } from '@angular/core';
import {LoadingComponent} from '@app/components/loading/loading.component';

@Component({
  selector: 'msc-reports',
  imports: [
    LoadingComponent
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {

}
