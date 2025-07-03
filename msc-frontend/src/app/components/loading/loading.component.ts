import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'msc-loading',
  imports: [
    NgIf
  ],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent implements OnInit {
  public height: string = '0px';
  public smallHeight: string = '0px';
  public labelHeight: string = '0px';
  public showLabel: boolean = false;

  constructor(private elementRef: ElementRef) {
  }

  public ngOnInit() {
    const el = this.elementRef.nativeElement as HTMLDivElement;
    const rect = el.parentElement.getBoundingClientRect();

    if (rect.height >= 150)
      this.showLabel = true;

    this.height = rect.height + 'px';

    el.style.height = this.height;
    el.style.width = this.height;

    this.smallHeight = (rect.height * .6) + 'px';
    this.labelHeight = Math.min(20, rect.height * .075) + 'px';
  }
}
