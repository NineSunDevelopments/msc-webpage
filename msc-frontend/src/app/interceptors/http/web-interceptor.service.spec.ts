import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from '@core/services/app/app.service';
import { AuthenticationService } from '@core/services/authentication/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { AppMockService } from '@test-helper/mocks/app.mock-service';
import { MatDialogMock } from '@test-helper/mocks/material.mocks';
import { AuthenticationMockService, TranslateMockService } from '@test-helper/mocks/services.mock';

import { WebInterceptorService } from './web-interceptor.service';

describe('WebInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {provide: AppService, useClass: AppMockService},
      {provide: TranslateService, useClass: TranslateMockService},
      {provide: AuthenticationService, useClass: AuthenticationMockService},
      {provide: MatDialog, useClass: MatDialogMock}],
  }));

  it('should be created', () => {
    const interceptor = TestBed.inject(WebInterceptorService);
    expect(interceptor).toBeTruthy();
  });
});
