import {Injectable} from '@angular/core';
import {WindowSizeService} from '@app/services/window-size/window-size.service';

import {Api, InitialApi} from '@app/types/api';
import {User} from '@shared/types/user';
import {WindowSize} from '@app/types/window';
import {Concrete} from '@shared/types/concrete';
import {deepCopy, deepEqual} from '@shared/utils/deep-equals';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Corps} from '@shared/types/corps';
import {MSCSettings} from '@shared/types/MSCSettings';


const Constructors: { [key: string]: (value: any) => any } = {}


export interface IAppState {
  api?: Api;
  autoUpdateEnabled?: boolean;
  autoUpdateTime?: number;
  corpsBase?: Corps[];
  corpsInCharge?: MSCSettings.CorpsInCharge;
  user?: User;
  userBase?: User[];
  windowSize?: WindowSize;
}

export class AppState implements Concrete<IAppState> {
  public api: Api;
  public autoUpdateEnabled: boolean = true;
  public autoUpdateTime: number = 5 * 1000;
  public corpsBase: Corps[];
  public corpsInCharge: MSCSettings.CorpsInCharge;
  public user: User;
  public userBase: User[];
  public windowSize: WindowSize;


  public static get Initial(): AppState {
    let initial: AppState = new AppState();

    initial.api = InitialApi;
    initial.user = null;
    initial.userBase = [];
    initial.windowSize = WindowSizeService.SetSize(window.innerWidth, window.innerHeight);

    return initial;
  }

  public static FromJson(source: string): AppState {
    return AppState.FromMutation(JSON.parse(source));
  }

  public static FromMutation(source: IAppState): AppState {
    const keys = Object.keys(AppState.Initial);
    const state = new AppState();

    for (const key in source) {
      if (!keys.includes(key)) {
        console.debug('Unknown key "' + key + '" while parsing');
      } else {
        state.set(key as keyof IAppState, source[key]);
      }
    }

    return state;
  }

  public set<T extends keyof this>(key: T, mutation: this[T]) {
    this[key] = mutation;
  }

  public get<T extends keyof this>(key: T): this[T] {
    return this[key];
  }

  public equals(other: AppState): boolean {
    for (const key in this) {
      const a = this.get(key);
      // @ts-ignore
      const b = other.get(key);

      if (!!a !== !!b || JSON.stringify(a) !== JSON.stringify(b))
        return false;
    }

    return true;
  }

  public clone(): AppState {
    return AppState.FromMutation(deepCopy(this));
  }

  public toDataObject(): IAppState {
    const dataObj: IAppState = {};

    for (let key in this) {
      if (typeof (this.get(key)) !== 'function') {
        // @ts-ignore
        dataObj[key] = this.get(key);
      }
    }

    return dataObj;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public autoUpdate: Subject<null> = new Subject<null>();
  private autoUpdateTimer: number;

  private states: BehaviorSubject<IAppState> = new BehaviorSubject<IAppState>(AppService.InitialState);

  private mutationTimeoutHandle: number = -1;
  private queuedMutation: IAppState = {};

  constructor() {
    let storedState = this.loadFromStorage();
    this.mutate(AppService.CleanMutation(storedState)).then();

    window.addEventListener('storage', (event) => {
      if (event.key === 'app-state')
        this.mutate(this.loadFromStorage()).then();
    });

    //this.checkAutoUpdate();
  }

  public static get InitialState(): AppState {
    return AppState.Initial;
  }

  public get observable(): Observable<IAppState> {
    return this.states.asObservable();
  }

  public get state(): IAppState {
    return this.states.value;
  }

  public static CleanMutation(state: any): AppState {
    if (!!state) {
      for (let iterator of Object.keys(state)) {
        if (!AppService.InitialState.hasOwnProperty(iterator)) {
          delete state[iterator];
        }
      }
    } else {
      state = {} as IAppState;
    }

    for (let iterator of Object.keys(AppService.InitialState)) {
      let key = iterator as keyof IAppState;

      if (!state.hasOwnProperty(key)) {
        state[key] = AppService.InitialState[key];
      }
    }

    return AppState.FromMutation(state);
  }

  public get<T>(key: keyof IAppState): T {
    return this.states.value[key] as unknown as T;
  }

  public checkAutoUpdate() {
    window.clearTimeout(this.autoUpdateTimer);
    this.autoUpdateTimer = window.setTimeout(() => {
      if (this.state.autoUpdateEnabled)
        this.autoUpdate.next(null);

      this.checkAutoUpdate();
    }, this.state.autoUpdateTime);
  }

  public loadFromStorage(): IAppState {
    const storage = window.localStorage.getItem('app-state');
    const rawState = !!storage ? AppState.FromJson(storage) : AppState.Initial;

    const instantiate = (entry: any, key: keyof IAppState) => {
      const constructorKey = key.replace("Base", "");
      const constructor = Constructors[constructorKey];

      if (!!constructor && typeof constructor === "function" && !!entry)
        return constructor(entry);
      else
        return entry;
    }

    for (const key in rawState) {
      const entry = rawState[key];
      if (Array.isArray(entry))
        rawState[key] = entry.map((e: any) => instantiate(e, key as keyof IAppState));
      else
        rawState[key] = instantiate(entry, key as keyof IAppState);
    }

    return rawState;
  }

  public mutate(mutation: IAppState): Promise<IAppState> {
    return new Promise<IAppState>((resolve, reject) => {
      this.queuedMutation = {...this.queuedMutation, ...mutation};

      window.clearTimeout(this.mutationTimeoutHandle);
      this.mutationTimeoutHandle = window.setTimeout(() => {

        const start = Date.now();
        const keys = Object.keys(this.queuedMutation) as (keyof IAppState)[];
        const current = AppState.FromMutation(this.state);
        const mutated = current.clone();
        const validKeys = Object.keys(AppState.Initial) as (keyof IAppState)[];

        for (const key of keys) {
          if (validKeys.includes(key)) {
            mutated.set(key, this.queuedMutation[key]);
          } else {
            console.warn(`Trying to set unknown item [${key}] in AppState, valid keys are [${validKeys.join(', ')}]`);
          }
        }

        if (!deepEqual(current, mutated)) {
          this.states.next(mutated);
          window.localStorage.setItem('app-state', JSON.stringify(AppService.CleanMutation(mutated.toDataObject())));

          this.queuedMutation = {};
        }

        resolve(mutated);
      }, 50);
    });
  }

  public reset(): Promise<IAppState> {
    window.localStorage.clear();
    return this.mutate(deepCopy(AppState.Initial));
  }
}
