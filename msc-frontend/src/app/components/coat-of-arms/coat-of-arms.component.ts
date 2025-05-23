import {Component, Input} from '@angular/core';
import {SafeUrl} from '@angular/platform-browser';
import {NgOptimizedImage} from '@angular/common';
import {Corps} from '@shared/types/corps';

@Component({
  selector: 'msc-coat-of-arms',
  imports: [ ],
  templateUrl: './coat-of-arms.component.html',
  styleUrl: './coat-of-arms.component.scss'
})
export class CoatOfArmsComponent {

  @Input() public corps: Corps = null;
  @Input() public showName: boolean = false;
  @Input() public clickable: boolean = false;

  public getUrl(): SafeUrl {
    return this.corps.coatOfArms as SafeUrl;
  }

  public openCorpsWebsite() {
    if (!this.clickable || this.corps.url === '')
      return;

    window.open(this.corps.url, '_blank');
  }
}
