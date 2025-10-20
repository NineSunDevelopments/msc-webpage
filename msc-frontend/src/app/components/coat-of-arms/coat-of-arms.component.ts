import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {SafeUrl} from '@angular/platform-browser';
import {NgOptimizedImage} from '@angular/common';
import {Corps} from '@shared/types/corps';

@Component({
  selector: 'msc-coat-of-arms',
  imports: [ ],
  templateUrl: './coat-of-arms.component.html',
  styleUrl: './coat-of-arms.component.scss'
})
export class CoatOfArmsComponent implements AfterViewInit {

  @Input() public corps: Corps = null;
  @Input() public showName: boolean = false;
  @Input() public clickable: boolean = false;

  @ViewChild('textRef') textRef: ElementRef;

  public ngAfterViewInit() {
    console.log(this.textRef.nativeElement);
    //window.fitText(this.textRef.nativeElement, 1);
  }

  public getUrl(): SafeUrl {
    return this.corps.coatOfArms as SafeUrl;
  }

  public openCorpsWebsite() {
    if (!this.clickable || this.corps.url === '')
      return;

    window.open(this.corps.url, '_blank');
  }
}
