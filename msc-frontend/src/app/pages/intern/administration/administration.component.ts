import { Component } from '@angular/core';
import {MatTab, MatTabBody, MatTabGroup} from '@angular/material/tabs';
import {MatAnchor} from '@angular/material/button';

@Component({
  selector: 'msc-administration',
  imports: [
    MatTabGroup,
    MatTab,
    MatTabBody,
    MatAnchor
  ],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.scss'
})
export class AdministrationComponent {

}
