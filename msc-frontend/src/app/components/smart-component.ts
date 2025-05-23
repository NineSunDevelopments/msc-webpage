import { Directive, Injector, NgZone, OnDestroy, OnInit } from '@angular/core';
import { MatDialog as MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService, AppState, IAppState } from '@app/services/app/app.service';
import { Debounce } from '@app/decorators/debounce.decorator';
import { User } from '@shared/types/user';
import { deepCopy, deepEqual } from '@shared/utils/deep-equals';
import { Subscription } from 'rxjs';

@Directive()
export abstract class SmartComponent implements OnInit, OnDestroy {

  public appService: AppService = {} as AppService;
  public appState: IAppState = AppState.Initial;
  public router: Router;
  public route: ActivatedRoute;

  protected dialog: MatDialog;

  protected subs: Subscription = new Subscription();
  protected waitForUserTimeout: number;

  protected constructor(
    private i: Injector,
  ) {
    this.router = this.i.get(Router);
    this.route = this.i.get(ActivatedRoute);
    this.dialog = this.i.get(MatDialog);
    this.appService = this.i.get(AppService);
  }

  public ngOnInit(): void {

    this.onInit();
    this.onInitAsync().then();

    this.subs.add(this.appService.observable.subscribe((state) => {
      this.i.get(NgZone).run(() => {
        if (!deepEqual(state, this.appState)) {
          this.onDataChange(state, this.appState);

          window.setTimeout(() => {
            this.appState = state;
            this._afterDataChange(state);
          });
        }
      });
    }));
  }

  public waitForUser(cb: (user: User) => void) {
    window.clearTimeout(this.waitForUserTimeout);
    if (this.appState.user) {
      cb(deepCopy(this.appState.user));
    } else {
      this.waitForUserTimeout = window.setTimeout(() => this.waitForUser(cb), 250);
    }
  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
    window.clearTimeout(this.waitForUserTimeout);
    this.onDestroy();
  }

  /**
   * Lifecycle Hooks
   */
  public onInit(): void {
  }

  public async onInitAsync() {
  }

  public onDestroy(): void {
  }

  public onDataChange(state: IAppState, previousState: IAppState) {
  }

  public afterDataChange(state: IAppState) {

  }

  @Debounce(500)
  private _afterDataChange(state: IAppState) {
    this.afterDataChange(state);
  }
}


