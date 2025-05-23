import {Component, Injector} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from '../header/header.component';
import {SmartComponent} from '@app/components/smart-component';
import {CorpsService} from '@app/services/corps/corps.service';
import {ApiService} from '@app/services/api/api.service';
import {CorpsInChargeService} from '@app/services/corps-in-charge/corps-in-charge.service';

@Component({
  selector: 'msc-application',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './application.component.html',
  styleUrl: './application.component.scss'
})
export class ApplicationComponent extends SmartComponent {
  title = 'msc-frontend';

  public loading = false;

  constructor(
    private corpsService: CorpsService,
    private corpsInChargeService: CorpsInChargeService,
    private apiService: ApiService,

    injector: Injector
  ) {
    super(injector);

    apiService.initialize();
  }

  public onInit() {
    console.log("INIT");
    this.corpsService.load()
      .then((result) => console.log({result}));

    this.corpsInChargeService.getCurrent();
  }
}
