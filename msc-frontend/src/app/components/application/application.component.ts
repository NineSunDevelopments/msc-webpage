import {Component, Injector} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {SmartComponent} from '@app/components/smart-component';
import {CorpsService} from '@app/services/corps/corps.service';
import {ApiService} from '@app/services/api/api.service';
import {SemesterSettingsService} from '@app/services/activities/semester-settings/semester-settings.service';
import {IAppState} from '@app/services/app/app.service';

@Component({
  selector: 'msc-application',
  imports: [RouterOutlet],
  templateUrl: './application.component.html',
  styleUrl: './application.component.scss'
})
export class ApplicationComponent extends SmartComponent {
  title = 'msc-frontend';

  public initialized = false;
  public loading = true;

  constructor(
    apiService: ApiService,
    private corpsService: CorpsService,
    private semesterSettingsService: SemesterSettingsService,
    injector: Injector
  ) {
    super(injector);

    apiService.initialize();
  }

  public async afterDataChange(state: IAppState) {
    this.loading = true;

    if (!!state.user && !this.initialized) {
      await Promise.all([
        this.corpsService.load(),
        this.semesterSettingsService.loadCurrent(),
        this.semesterSettingsService.load()
      ]);

      this.initialized = true;
      this.loading = false;
    }

    if (!state.user) {
      this.initialized = false;
    }

    this.loading = false;
  }
}
