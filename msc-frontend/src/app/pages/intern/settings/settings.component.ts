import { Component } from '@angular/core';
import {LoadingComponent} from "@app/components/loading/loading.component";

@Component({
  selector: 'msc-settings',
    imports: [
        LoadingComponent
    ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

}
