import {Component, Injector} from '@angular/core';
import {CorpsService} from '@app/services/corps/corps.service';
import {SmartComponent} from '@app/components/smart-component';
import {IAppState} from '@app/services/app/app.service';
import {MatTableModule} from '@angular/material/table';
import {Corps} from '@shared/types/corps';
import {NgForOf, NgIf} from '@angular/common';
import {MatAnchor} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {LoadingComponent} from '@app/components/loading/loading.component';
import {MatFormField, MatInput, MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {ColorsComponent} from '@app/components/colors/colors.component';
import {deepCopy} from '@shared/utils/deep-equals';
import {MatCheckbox} from '@angular/material/checkbox';

@Component({
  selector: 'msc-corps',
  imports: [MatTableModule, NgForOf, MatAnchor, NgIf, MatIconModule, RouterLink, LoadingComponent, MatFormField, MatInputModule, MatFormField, FormsModule, ColorsComponent, MatCheckbox],
  templateUrl: './corps.component.html',
  styleUrl: './corps.component.scss'
})
export class CorpsComponent extends SmartComponent {

  public displayedColumns: (keyof Corps | string)[] = ['position', 'colors', 'name', 'url', 'external', 'actions'];
  public corpsId: string = null;
  public selectedCorps: Corps = null;
  public selectedCorpsOriginal: Corps = null;
  public editMode: boolean = false;

  public loading = true;

  constructor(
    injector: Injector,
    private corpsService: CorpsService,
  ) {
    super(injector);

    this.subs.add(this.route.paramMap.subscribe(paramsMap => {
      this.corpsId = paramsMap.get("id") ?? null;

      if (!this.corpsId) {
        this.corpsId = null;
        this.selectedCorps = null;
        this.selectedCorpsOriginal = null;
      }
    }));
    this.subs.add(this.route.url.subscribe((url) => {
      this.editMode = url.some(x => x.path === "edit");
    }));
  }

  public afterDataChange(state: IAppState) {
    if (this.corpsId) {
      this.selectedCorps = deepCopy(state.corpsBase.find(corps => corps._id === this.corpsId));
      this.selectedCorpsOriginal = deepCopy(this.selectedCorps);

      if (!this.selectedCorps.colors)
        this.selectedCorps.colors = [];
    }

    this.loading = false;
  }

  public saveCorps(corps: Corps) {
    this.corpsService.update(corps).then((updated) => {
      this.appState.corpsBase = updated;
      this.router.navigate(['intern', 'corps', corps._id]).then();
    })
  }

  public cancel() {
    this.selectedCorps = deepCopy(this.selectedCorpsOriginal);
    this.router.navigate(['intern', 'corps', this.selectedCorpsOriginal._id]).then();
  }

  public editCorps(corps: Corps) {
    this.router.navigate(['intern', 'corps', corps._id, 'edit']).then();
  }

  public showCorps(corps: Corps) {
    this.router.navigate(['intern', 'corps', corps._id]).then();
  }

  public canEdit(corps: Corps): boolean {
    return this.appState.user?.corpsId === corps._id;
  }
}
