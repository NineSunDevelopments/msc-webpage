import {ApplicationConfig, LOCALE_ID, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {WebInterceptorService} from '@app/interceptors/http/web-interceptor.service';
import {provideLuxonDateAdapter} from '@angular/material-luxon-adapter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    {provide: LOCALE_ID, useValue: 'de-DE' },
    provideRouter(routes),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WebInterceptorService,
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
    provideLuxonDateAdapter()
  ],
};
