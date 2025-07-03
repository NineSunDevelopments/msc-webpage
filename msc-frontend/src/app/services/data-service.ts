import { Injector } from '@angular/core';
import { ApiService } from '@app/services/api/api.service';
import { AppService, IAppState } from '@app/services/app/app.service';
import { SHA256 } from 'crypto-js';
import { camelize } from '@shared/utils/camelize';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface DataServiceOptions {
  link: string;
  injector: Injector;
  skipLocalStorage?: boolean;
}

export interface Cache<T> {
  id: string;
  data: T;
  checksum: string;
}

/***
 * Base class for all data services
 * @template T
 * @class
 *
 * @example
 * class MyDataService extends DataService<MyData> {
 *    constructor(injector: Injector) {
 *      super({
 *        link: '/my-data', // backend endpoint
 *        injector, // angular injector
 *      });
 *    }
 * }
 */
export class DataService<T> {

  public appService: AppService;
  public api: ApiService;

  public useLocalStorage: boolean = true;
  public readonly dataLink: string;
  public readonly name: string;

  /***
   * @constructor
   * @param {DataServiceOptions} options
   * @param {string} options.link - backend endpoint
   * @param {Injector} options.injector - angular injector
   * @param {boolean} options.skipLocalStorage - skip local storage
   * @param {T} classType - class type
   *
   * @example
   * class MyDataService extends DataService<MyData> {
   *    constructor(injector: Injector) {
   *      super({
   *        link: '/my-data', // backend endpoint
   *        injector, // angular injector
   *      });
   *    }
   * }
   */
  public constructor(options: DataServiceOptions, private classType?: {new (T) : T}) {
    this.dataLink = options.link;
    this.useLocalStorage = options.skipLocalStorage === undefined || options.skipLocalStorage === false;
    this.name = camelize(this.dataLink.replace(/\//g, ''));

    this.appService = options.injector.get(AppService);
    this.api = options.injector.get(ApiService);
  }


  protected caches: Cache<any[]>[] = [];
  protected makeCacheId(...args: any[]): string {
    return SHA256(JSON.stringify(args)).toString();
  }
  protected addCache<T>(id: string, data: T[], checksum: string) {
    for(let cache of this.caches) {
      if (cache.id === id) {
        cache.data = data;
        cache.checksum = checksum;
        return;
      }
    }

    this.caches.push({ id, data, checksum });
  }
  protected getCache<T>(id: string): Cache<T[]> {
    return this.caches.find((c) => c.id === id);
  }

  public load(forceData?: boolean): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      this.api.get<T[]>(this.dataLink, {})
        .then((result: T[]) => resolve(this.mutate(result?.map(this.sanitize))))
        .catch(error => reject(error))
        .finally(() => resolve([]));
    });
  }

  public loadMany(ids: string[]): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      this.api.post<T[]>(this.dataLink + '/many', ids)
        .then((result: T[]) => resolve(result?.map(this.sanitize)))
        .catch(error => reject(error))
        .finally(() => resolve([]));
    });
  }
  public loadObs(): Observable<T[]> {
    return this.api.getObs<T[]>(this.dataLink, {}).pipe(map((result: T[]) => this.mutate(result?.map(this.sanitize))));
  }

  public getOverview(params): Observable<T[]> {
    const queryString = new URLSearchParams(params);

    return this.api.getObs<T[]>(this.dataLink + '/overview?' + queryString.toString(), {}).pipe(map((result: T[]) => this.mutate(result?.map(this.sanitize))));
  }

  public insert(data: T, skipLoading: boolean = false): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.api.post<T>(this.dataLink, data).then(
        (result: T) => skipLoading ? resolve(result) : this.patch(result) && resolve(result),
      ).catch(error => reject(error));
    });
  }
  public insertBatch(data: T[]): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      this.api.post<T[]>(this.dataLink + '/batch', data).then(
        (result: T[]) => resolve((this.patchBatch(result) as T[]).slice(-1)),
      ).catch(error => reject(error));
    });
  }
  public insertObs(data: T): Observable<T> {
    return this.api.postObs<T>(this.dataLink, data).pipe( map((result: T) => this.sanitize(result)));
  }

  public delete(data: T): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      // @ts-ignore
      const oldState = this.appService.state[this.name + 'Base'] ?? [];

      // @ts-ignore
      const newState = this.appService.state[this.name + 'Base']?.filter(s => s['id'] !== data['id']) ?? [];

      resolve(this.mutate(newState));

      // @ts-ignore
      this.api.delete(this.dataLink + `/${ data['id'] }`).then(
        _ => resolve(newState))
        .catch(error => {
            this.mutate(oldState);
            reject(error);
          },
        );
    });
  }
  public deleteBatch(batch: T[]): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      // @ts-ignore
      const identifier: keyof IAppState = this.name + 'Base';

      const oldState = this.appService.get<T[]>(identifier) ?? [];
      const newState = (oldState.length > 0 ?  oldState : [])
        .filter((s: any) => batch.find((x: any) => x.id === s.id) === undefined) ?? [];

      // @ts-ignore
      this.api.post(this.dataLink + `/delete-batch`, batch.map(x => x.id)).then(
        _ => this.load().then(x => resolve(this.mutate(x))))
        .catch(error => {
            reject(error);
          },
        );
    });
  }
  public deleteObs(data: T | string | number): Observable<boolean> {
    const id = typeof data === "string" || typeof data === "number"
      ? data
      : data["id"];

    return this.api.deleteObs(this.dataLink + `/${ id }`);
  }

  public update(data: T, skipLoading: boolean = false): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      this.api.put<T>(this.dataLink, data).then(
        (result: T) => skipLoading ? resolve([]) : this.load().then(x => resolve(x)),
      ).catch(error => reject(error));
    });
  }
  public updateBatch(data: T[]): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      this.api.put<T[]>(this.dataLink + '/batch', data).then(
        (result: T[]) => resolve((this.patchBatch(result) as T[]).slice(-1)),
      ).catch(error => reject(error));
    });
  }
  public updateObs(data: T): Observable<T> {
    return this.api.putObs<T>(this.dataLink, data).pipe(map((result: T) => this.sanitize(result)));
  }


  /***
   * Patch an entry
   * @param entry
   * @returns {T[]}
   * @description
   * This method is used to patch an entry.
   *
   * @see DataService
   *
   * @example
   * service.patch(entry); // returns [...state, entry]
   */
  public patch(entry: T): T[] {
    let match = false;

    // @ts-ignore
    const state = this.appService?.state[this.name + 'Base']?.map((s: T) => {
      // @ts-ignore
      if (s['id'] === entry['id']) {
        match = true;
        return entry;
      } else {
        return s;
      }
    }) ?? [];

    if (!match) {
      state.push(entry);
    }

    return this.mutate(state);
  }

  /***
   * Patch a batch of entries
   * @param entries
   * @returns {T[]}
   * @description
   * This method is used to patch a batch of entries.
   *
   * @see DataService
   *
   * @example
   * service.patchBatch([entry1, entry2]); // returns [...state, entry1, entry2]
   */
  public patchBatch(entries: T[]): T[] {
    let match = false;
    // @ts-ignore
    let state = this.appService.state[this.name + 'Base'] ?? [];
    entries.map(entry => {
      entry = this.sanitize(entry);

      state = state.map((s: T) => {
        // @ts-ignore
        if (s['id'] === entry['id']) {
          match = true;
          return entry;
        } else {
          return s;
        }
      });
      if (!match) {
        state.push(entry);
      }
    });
    return this.mutate(state);
  }

  /***
   * Mutate the data set
   * @param state
   * @returns {T[]}
   * @description
   * This method is used to mutate the data set.
   *
   * @see DataService
   *
   * @example
   * service.mutate({[stateName]: newState});
   */
  public mutate(state: T[]): T[] {
    state = state.map(this.sanitize.bind(this));
    if (this.useLocalStorage) {
      this.appService.mutate({ [this.name + 'Base']: state } as IAppState).then();
    }
    return state;
  }
  /***
   * Mutate a single element in the data set
   * @param state
   * @returns {T}
   * @description
   * This method is used to mutate a single element in the data set.
   *
   * @see DataService
   *
   * @example
   * service.mutateSingle({[stateName]: newState});
   */
  public mutateSingle(state: T): T {
    state = this.sanitize(state);
    this.appService.mutate({ [this.name]: state } as IAppState).then();
    return state;
  }

  /***
   * Find elements in the data set
   * @param query
   * @param set - optional
   * @returns {T[]}
   * @description
   * This method is used to find elements in the data set.
   *
   * @see DataService
   *
   * @example
   * service.find(x => x.id > 10); // returns all elements with id > 10
   */
  public find(query: (x: T) => boolean, set: T[] = []): T[] {
    const state = this.appService?.state[this.name + 'Base'] ?? [];
    const emptySet = (!set || set.length === 0);
    const emptyState = (!state || state.length === 0);

    if (emptySet && emptyState) {
      return [];
    }

    if (emptySet) {
      return state.filter(query);
    }

    return set.filter(query);
  }

  /***
   * Find one element in the data set
   * @param query
   * @param set - optional
   * @returns {T}
   * @description
   * This method is used to find a single element in the data set.
   *
   * @see DataService
   * @see DataService.find
   *
   * @example
   * service.findOne(x => x.id === 1); // returns the element with id = 1
   */
  public findOne(query: (x: T) => boolean, set: T[] = null): T {
    const result = this.find(query, set);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Sanitize single data entry
   * @type {typeof element}
   * @memberof DataService
   * @description
   * This method is used to sanitize a single data entry.
   * It is called by the load, insert, update and delete methods.
   * Should be overwritten by the child class.
   *
   * @see DataService
   * @see DataService.load
   * @see DataService.insert
   * @see DataService.update
   * @see DataService.delete
   */
  protected sanitize(element: T): T {
    return this?.tryConstruct(element) ?? element;
  }

  private tryConstruct(data: T): T {
    try {
      return new this.classType(data);
    } catch (e) {
      return data;
    }
  }
}
