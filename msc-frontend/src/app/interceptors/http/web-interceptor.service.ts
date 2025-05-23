import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {MatDialog as MatDialog} from '@angular/material/dialog';
import {AppService} from '@app/services/app/app.service';
import {NoticeDialogConfig} from '@dialogs/constants/dialog-configs';
import {NoticeComponent, NoticeType} from '@dialogs/dialogs/notice/notice.component';
import {APIErrorResponse} from '@app/types/api';
import {deepCopy} from '@shared/utils/deep-equals';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {DateTime} from 'luxon';


@Injectable({providedIn: 'root'})
export class WebInterceptorService implements HttpInterceptor {

  constructor(
    private appService: AppService,
    private dialog: MatDialog,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = this.appService.state.user;
    const body = req.body instanceof FormData ? req.body : deepCopy(req.body);

    let authReq = req.clone({
      body: this.parseDates(body, 'encode')
    });

    if (user && user.token && user._id) {
      authReq = authReq.clone({
        headers: req.headers
          .set('auth-token', encodeURIComponent(user.token))
          .set('auth-id', encodeURIComponent(user._id)),
      });
    }

    return next.handle(authReq).pipe(
      tap(
        (response) => response instanceof HttpResponse ? this.parseDates(response, 'decode') : response,
        (errorResponse: APIErrorResponse) => {
          const api = this.appService.state.api;
          switch (errorResponse.status) {
            case 0:
              this.appService.mutate({
                api: {
                  ...api,
                  connection: {client: navigator.onLine, api: false},
                  error: {code: 0, text: 'UNREACHABLE'},
                },
              }).then(() => {
                this.dialog.open(NoticeComponent, {
                  ...NoticeDialogConfig,
                  data: {
                    type: NoticeType.Warning,
                    message: "Es ist ein interner Fehler aufgetreten.",
                  },
                });
              });
              break;
            case 401:
              this.appService.mutate({
                api: {
                  ...api,
                  error: {
                    code: errorResponse.status,
                    text: errorResponse.error.message ?? 'api.error.auth.sessionExpired'
                  },
                },
              }).then(() => {
                this.dialog.open(NoticeComponent, {
                  ...NoticeDialogConfig,
                  data: {
                    type: NoticeType.Warning,
                    message: "Sitzung abgelaufen. Bitte melden Sie sich erneut an.",
                  },
                });
              });
              break;
            case 304:
              break;
            case 500:
              this.appService.mutate({
                api: {
                  ...api,
                  error: {code: 500, text: 'INTERNAL_ERROR'},
                },
              }).then(() => {
                this.dialog.open(NoticeComponent, {
                  ...NoticeDialogConfig,
                  data: {
                    type: NoticeType.Error,
                    message: "Es ist ein interner Fehler aufgetreten.",
                  },
                });
              });
              break;
            default:
              this.appService.mutate({
                api: {
                  ...api,
                  error: {code: errorResponse.status, text: errorResponse.error.message ?? 'error.unknown'},
                },
              }).then(() => {
                this.dialog.open(NoticeComponent, {
                  ...NoticeDialogConfig,
                  data: {
                    type: NoticeType.Error,
                    message: "Anfrage fehlerhaft.",
                  },
                });
              });
              break;
          }
        },
      ),
    );
  }

  private parseDates(response: any, direction: 'encode' | 'decode', depth: number = 10): any {
    if (direction === 'encode') {
      if (DateTime.isDateTime(response)) {
        return new DateTime(response).utc().toISOString();
      }

      if (typeof (response) === 'object')
        for (const key in response) {
          response[key] = this.parseDates(response[key], 'encode', --depth);
        }
    } else {

      if (typeof response === 'string') {
        const dateRegExp = /(\d{4}-\d{2}-\d{2})T?(\d{2}:\d{2}:\d{2}.\d{3})?\+?(\d{2}:\d{2})?/;

        if (dateRegExp.test(response)) {
          const date: DateTime = new DateTime(response);
          if (date.isValid) {
            return date.toLocal();
          }
        }
      }

      if (typeof (response) === 'object')
        for (const key in response)
          response[key] = this.parseDates(response[key], 'decode', --depth);
    }
    return response;
  }
}
