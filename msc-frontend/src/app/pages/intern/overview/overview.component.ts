import { Component } from '@angular/core';
import {LoadingComponent} from "@app/components/loading/loading.component";
import {NgIf} from '@angular/common';

@Component({
  selector: 'msc-overview',
  imports: [
    LoadingComponent,
    NgIf
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  public loading = false;

}
