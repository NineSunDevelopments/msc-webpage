import {CdkDrag, CdkDragHandle} from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule as MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';
import {MatProgressBarModule as MatProgressBarModule} from '@angular/material/progress-bar';
import {MatRadioModule as MatRadioModule} from '@angular/material/radio';

import {CloseComponent} from './components/close/close.component';
import {ConfirmationComponent} from './dialogs/confirmation/confirmation.component';
import {NoticeComponent} from './dialogs/notice/notice.component';

import {DialogBodyComponent} from './components/dialog-body/dialog-body.component';
import {DialogFooterComponent} from './components/dialog-footer/dialog-footer.component';
import {DialogHeaderComponent} from './components/dialog-header/dialog-header.component';
import {DialogWrapperComponent} from './components/dialog-wrapper/dialog-wrapper.component';



@NgModule({
  declarations: [
    CloseComponent,
    DialogHeaderComponent,
    DialogBodyComponent,
    DialogFooterComponent,
    DialogWrapperComponent,
    ConfirmationComponent,
    NoticeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonToggleModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatListModule,
    CdkDrag,
    CdkDragHandle,
  ],
})
export class DialogsModule {
}
