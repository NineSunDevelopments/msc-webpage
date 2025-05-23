import { AfterViewInit, Component, ContentChild, ElementRef, Input, OnInit, TemplateRef } from '@angular/core';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef as MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {CdkDrag, CdkDragHandle} from '@angular/cdk/drag-drop';
import {NgIf, NgTemplateOutlet} from '@angular/common';
import {MatAnchor} from '@angular/material/button';


@Component({
  selector: 'dialog-wrapper',
  templateUrl: './dialog-wrapper.component.html',
  styleUrls: ['./dialog-wrapper.component.scss'],
  imports: [
    CdkDrag,
    CdkDragHandle,
    NgIf,
    MatDialogTitle,
    NgTemplateOutlet,
    MatDialogContent,
    MatDialogActions,
    MatAnchor
  ]
})
export class DialogWrapperComponent implements AfterViewInit {

  @Input() public dialogRef: MatDialogRef<any>;
  @Input() public loading = false;
  @Input() public closeX = true;
  @Input() public minimizable = false;

  public minimized = false;

  @ContentChild('header', { static: true }) public header: TemplateRef<any>;
  @ContentChild('body', { static: true }) public body: TemplateRef<any>;
  @ContentChild('footer', { static: true }) public footer: TemplateRef<any>;

  private dialogWrapper: HTMLElement;
  private initialMaxWidth: string;
  private initialWidth: string;
  private initialTransform: string;

  public constructor(private elementRef: ElementRef) {
  }

  public ngAfterViewInit() {
    if (this.minimizable && this.minimized)
      this.minimize();
  }

  public close() {
    this.dialogRef.close(null);
  }

  public minimize() {
    if (!this.minimizable)
      return;

    this.dialogWrapper = this.elementRef.nativeElement.closest('.cdk-overlay-pane');
    if (!this.dialogWrapper)
      return;

    this.initialWidth = this.dialogWrapper.style.width;
    this.initialMaxWidth = this.dialogWrapper.style.maxWidth;
    this.initialTransform = this.dialogWrapper.style.transform;

    this.dialogWrapper.style.width = '400px';
    this.dialogWrapper.style.maxWidth = '400px';
    this.dialogWrapper.style.transform = '';

    this.minimized = true;

    window.setTimeout(() => {
      this.dialogRef.updatePosition({ bottom: '20px', right: '20px' });
    }, 150);
  }

  public maximize() {
    this.minimized = false;

    this.dialogWrapper.style.width = this.initialWidth;
    this.dialogWrapper.style.maxWidth = this.initialMaxWidth;
    this.dialogWrapper.style.transform = this.initialTransform;

    this.dialogRef.updatePosition({ left: `calc(50% - (${this.dialogWrapper.style.width} / 2)` });
  }
}
