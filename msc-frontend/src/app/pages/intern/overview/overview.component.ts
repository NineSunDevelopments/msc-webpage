import { Component } from '@angular/core';
import {LoadingComponent} from "@app/components/loading/loading.component";

@Component({
  selector: 'msc-overview',
    imports: [
        LoadingComponent
    ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {

}
