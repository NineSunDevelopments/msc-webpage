import { Component } from '@angular/core';
import {LoadingComponent} from "@app/components/loading/loading.component";

@Component({
  selector: 'msc-activities',
    imports: [
        LoadingComponent
    ],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.scss'
})
export class ActivitiesComponent {

}
