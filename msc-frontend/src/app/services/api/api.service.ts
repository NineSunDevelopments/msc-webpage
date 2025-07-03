import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import {Injectable, isDevMode, OnDestroy} from '@angular/core';
import { MatDialog as MatDialog } from '@angular/material/dialog';
import { AppService } from '../app/app.service';
import { APIErrorResponse, Request } from '@app/types/api';
import { fromEvent, Observable, Subscription } from 'rxjs';


export interface HttpOptions {
  raw?: boolean;
  headers?: HttpHeaders;
  observe?: 'body' | 'response';
  params?: HttpParams;
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}
export interface BodyHttpOptions extends HttpOptions {
  observe: 'body';
  responseType: 'json';
}
export interface ResponseHttpOptions extends HttpOptions {
  observe: 'response';
  responseType: 'json';
}

const host = isDevMode() ? 'http://localhost:1951' : 'https://api.msc-corps.de';


@Injectable({
  providedIn: 'root',
})
export class ApiService implements OnDestroy {
  public backendURI = ApiService.CleanUrl(host);
  public queue: Request<any>[] = [];

  private initialized = false;
  private listenerAdded = false;

  private subscription: Subscription = new Subscription();

  constructor(
    private http: HttpClient,
    private appService: AppService,
  ) {
  }

  public static get CacheBlock() {
    return Math.floor((Math.random() * 999999)).toString();
  }

  public static SanitizeURL(url: string): string {
    return (url[0] !== '/' ? '/' : '') + url;
  }

  private static CleanUrl(apiUrl: string): string {
    return apiUrl[apiUrl.length - 1] === '/' ? apiUrl.substr(0, apiUrl.length - 2) : apiUrl;
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public isLoading(): boolean {
    return this.queue.filter(x => !x.name.includes('auth')).length > 0;
  }

  public initialize() {
    this.initialized = true;
    this.addListener();
    this.workQueue();
  }

  public status<T>(url: string, body: any, options?: HttpOptions): Promise<HttpResponse<T>> {
    return new Promise((resolve, reject) => {
      const uri = new URL(this.backendURI + ApiService.SanitizeURL(url));

      options = this.makeHttpOptions(options);

      this.addToQueue<HttpResponse<T>>({
          name: this.backendURI + ApiService.SanitizeURL(url),
          observable: this.http.post<T>(uri.href, body, {
            ...options,
            observe: 'response',
          }),
        },
        resolve, reject);
    });
  }

  public post<T>(url: string, body: any, options?: HttpOptions): Promise<T> {
    return new Promise((resolve, reject) => {
      const uri = new URL(this.backendURI + ApiService.SanitizeURL(url));

      options = this.makeHttpOptions(options);

      this.addToQueue<T>({
          name: this.backendURI + ApiService.SanitizeURL(url),
          // @ts-ignore
          observable: this.http.post<T>(uri.href, body, options),
        },
        resolve, reject);
    });
  }
  public postObs<T>(url: string, body: T, options?: HttpOptions): Observable<T> {
    const uri = new URL(this.backendURI + ApiService.SanitizeURL(url));

    options = this.makeHttpOptions(options);
    // @ts-ignore
    return this.http.post<T>(uri.href, body, options);
  }


  public put<T>(url: string, body: T, options?: HttpOptions): Promise<T> {
    return new Promise((resolve, reject) => {
      const uri = new URL(this.backendURI + ApiService.SanitizeURL(url));

      options = this.makeHttpOptions(options);

      this.addToQueue<T>({
          name: this.backendURI + ApiService.SanitizeURL(url),
          // @ts-ignore
          observable: this.http.put<T>(uri.href, body, options.observe === 'body' ? (options as BodyHttpOptions) : (options as ResponseHttpOptions)),
        },
        resolve, reject);
    });
  }
  public putObs<T>(url: string, body: T, options?: HttpOptions): Observable<T> {
    const uri = new URL(this.backendURI + ApiService.SanitizeURL(url));

    options = this.makeHttpOptions(options);
    // @ts-ignore
    return this.http.put<T>(uri.href, body, options);
  }


  public get<T>(url: string, options?: HttpOptions, force: boolean = true): Promise<T> {
    return new Promise((resolve, reject) => {
      const uri = new URL(this.backendURI + ApiService.SanitizeURL(url));

      options = this.makeHttpOptions(options);

      this.addToQueue<T>({
          name: this.backendURI + ApiService.SanitizeURL(url),
          // @ts-ignore
          observable: this.http.get<T>(uri.href, options),
        },
        resolve, reject);
    });
  }
  public getObs<T>(url: string, options?: HttpOptions): Observable<T> {
      const uri = new URL(this.backendURI + ApiService.SanitizeURL(url));
      options = this.makeHttpOptions(options);
    // @ts-ignore
      return this.http.get<T>(uri.href, options);
  }


  public delete<T>(url: string, options?: HttpOptions): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const uri = new URL(this.backendURI + ApiService.SanitizeURL(url));

      options = this.makeHttpOptions(options);

      this.addToQueue<boolean>({
          name: this.backendURI + ApiService.SanitizeURL(url),
          // @ts-ignore
          observable: this.http.delete<boolean>(uri.href, options),
        },
        resolve, reject);
    });
  }
  public deleteObs<T>(url: string, options?: HttpOptions): Observable<boolean> {
    const uri = new URL(this.backendURI + ApiService.SanitizeURL(url));

    options = this.makeHttpOptions(options);
    // @ts-ignore
    return this.http.delete<boolean>(uri.href, options);
  }

  public popup(url: string, options?: string) {
    const uri = new URL(this.backendURI + ApiService.SanitizeURL(url));
    window.open(uri.href, options);
  }


  private addToQueue<T>(request: Request<T>, resolve: (value: T) => void, reject: (error: HttpErrorResponse) => void) {
    request.resolvers = request.resolvers && request.resolvers.length !== 0 ? request.resolvers : [ resolve ];
    request.rejecters = request.rejecters && request.rejecters.length !== 0 ? request.rejecters : [ reject ];

    let replaced = false;

    this.queue = this.queue.map(entry => {
      if (entry.name === request.name) {
        replaced = true;
        request.resolvers = entry.resolvers.concat(resolve);
        request.rejecters = entry.rejecters.concat(reject);
        return request;
      }

      return entry;
    });

    if (!replaced)
      this.queue.push(request);
  }

  private workQueue() {
    if (this.initialized) {
      if (this.queue.length > 0 && this.queue[0]) {
        const item = this.queue[0];
        let subscription: Subscription = null;
        try {
          subscription = item.observable.subscribe({
            next: (data: any) => item.resolvers.map((entry: any) => entry(data)),
            error: (error: APIErrorResponse) => item.rejecters.map((entry: any) => entry(error)),
            complete: () => subscription.unsubscribe(),
          });

          if (!!subscription)
            this.subscription.add(subscription);

          this.queue.shift();
        } catch (e) {
          item.rejecters.map((entry: any) => entry({
            error: {
              message: 'error.unknown',
              additionalData: {},
            },
            name: 'HttpErrorResponse',
            message: '',
            ok: false,
            headers: new HttpHeaders,
            status: 500,
            statusText: '',
            url: 'none',
            type: HttpEventType.ResponseHeader,
          }));
          if (!!subscription)
            subscription.unsubscribe();
        }
      }

    }
    window.setTimeout(() => this.workQueue(), 25);
  }

  private addListener() {
    if (!this.listenerAdded) {
      fromEvent(window, 'online').subscribe(() => {
        const state = this.appService.state.api;
        state.connection.client = true;
        this.appService.mutate({ api: state });
      });

      fromEvent(window, 'offline').subscribe(() => {
        const state = this.appService.state.api;
        state.connection.client = false;
        this.appService.mutate({ api: state });
      });
    }
  }

  private addCacheControlHeaders(headers: HttpHeaders): HttpHeaders {
    headers = headers.append('Cache-Control', 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0');
    headers = headers.append('Pragma', 'no-cache');
    headers = headers.append('Expires', '0');
    return headers;
  }

  private makeHttpOptions(options: HttpOptions): HttpOptions {
    options = options ?? {};
    options = {
      raw: false,
      observe: options.observe ?? 'body',
      headers: this.addCacheControlHeaders(options.headers ?? new HttpHeaders()),
      params: options.params ?? new HttpParams(),
      reportProgress: true,
      responseType: options.responseType ?? 'json',
      withCredentials: false,
    };

    if (options.observe === 'body') {
      return options as BodyHttpOptions;
    } else {
      return options as ResponseHttpOptions;
    }
  }
}
