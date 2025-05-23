import { MatDialogConfig as MatDialogConfig } from '@angular/material/dialog';

export const DefaultDialogConfig: MatDialogConfig = {
  width: '1280px',
  maxWidth: '98%',
  maxHeight: '98%',
  hasBackdrop: false,
};

export const ConfirmationDialogConfig: MatDialogConfig = {
  ...DefaultDialogConfig,
  width: '500px',
  maxWidth: '90%',
  data: {
    message: '',
    confirm: () => alert('action not defined'),
  },
};

export const NoticeDialogConfig: MatDialogConfig = {
  ...DefaultDialogConfig,
  width: '500px',
  enterAnimationDuration: 0,
  exitAnimationDuration: 0,
  maxWidth: '90%',
  position: {
    top: '20px',
    right: '20px',
  },
};

