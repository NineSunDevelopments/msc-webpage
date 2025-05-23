import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {SidebarComponent} from '@app/components/sidebar/sidebar.component';

@Component({
  selector: 'msc-intern',
  imports: [
    RouterOutlet,
    SidebarComponent
  ],
  templateUrl: './intern.component.html',
  styleUrl: './intern.component.scss'
})
export class InternComponent {

}
