import {Component, Input} from '@angular/core';
import {Corps} from '@shared/types/corps';
import {NgIf} from '@angular/common';

@Component({
  selector: 'msc-colors',
  imports: [ NgIf ],
  templateUrl: './colors.component.html',
  styleUrl: './colors.component.scss'
})
export class ColorsComponent {
    @Input() corps: Corps;
    @Input() vertical: boolean = false;
}
