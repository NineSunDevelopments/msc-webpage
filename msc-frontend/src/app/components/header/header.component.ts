import {Component, ElementRef, HostListener} from '@angular/core';
import {Debounce} from '../../decorators/debounce.decorator';

@Component({
  selector: 'msc-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public title: string = 'Münchner Senioren Convent';
  public active: boolean = false;

  constructor( ) { }

  @HostListener('window:scroll', ['$event']) // for window scroll events
  @Debounce(10)
  public onScroll(event: Event): void {
    const html = document.querySelector('html') as HTMLElement;
    const offset = html?.scrollTop;

    this.active = offset > 500;
  }
}
