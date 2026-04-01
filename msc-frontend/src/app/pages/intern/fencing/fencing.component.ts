import {Component, inject} from '@angular/core';
import {CorpsSelectorComponent} from "@app/components/corps-selector/corps-selector.component";
import {FormsModule} from "@angular/forms";
import {LoadingComponent} from "@app/components/loading/loading.component";
import {MatAnchor} from "@angular/material/button";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatFooterCell,
  MatFooterCellDef,
  MatFooterRow,
  MatFooterRowDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from "@angular/material/table";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatIcon} from "@angular/material/icon";
import {NgIf} from "@angular/common";
import {Fencing} from '@shared/types/fencing';
import {SmartComponent} from '@app/components/smart-component';
import {IAppState} from '@app/services/app.service';
import {FencingArbiterService} from '@app/services/fencing-arbiter.service';
import {FencingDoctorService} from '@app/services/fencing-doctor.service';
import {Corps} from '@shared/types/corps';
import {DateTime} from 'luxon';
import {MatFormField, MatInput} from '@angular/material/input';
import {CorpsService} from '@app/services/corps.service';
import {RouterLink} from '@angular/router';

interface Arbiter extends Fencing.Arbiter {
  editMode: boolean;
}

interface Doctor extends Fencing.Doctor {
  editMode: boolean;
}

@Component({
  selector: 'msc-fencing',
  imports: [
    CorpsSelectorComponent,
    FormsModule,
    LoadingComponent,
    MatAnchor,
    MatCell,
    MatCellDef,
    MatCheckbox,
    MatColumnDef,
    MatFooterCell,
    MatFooterRow,
    MatFooterRowDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatRow,
    MatRowDef,
    MatTable,
    NgIf,
    MatHeaderCellDef,
    MatFooterCellDef,
    MatFormField,
    MatInput,
    RouterLink
  ],
  templateUrl: './fencing.component.html',
  styleUrl: './fencing.component.scss'
})
export class FencingComponent extends SmartComponent {
  public arbiters: Arbiter[] = [];
  public doctors: Doctor[] = [];
  public arbiterColumns: (keyof Arbiter | string)[] = [
    "active",
    "name",
    "corpsId",
    "email",
    "phone",
    "actions"
  ];
  public doctorColumns: (keyof Doctor | string)[] = [
    "active",
    "external",
    "name",
    "corpsId",
    "email",
    "phone",
    "actions"
  ];

  public loading = true;

  private arbiterService = inject(FencingArbiterService);
  private doctorService = inject(FencingDoctorService);
  private corpsService = inject(CorpsService);

  constructor() {
    super();
  }

  public async onInit() {
    if (this.appState.corpsBase.length === 0)
      await this.corpsService.load();

    this.arbiters = (await this.arbiterService.load())
      .map(x => ({...x, editMode: false}))
      .sort((a, b) => a.name.localeCompare(b.name));
    this.doctors = (await this.doctorService.load())
      .map(x => ({...x, editMode: false}))
      .sort((a, b) => a.name.localeCompare(b.name));

    this.loading = false;
  }

  public afterDataChange(state: IAppState) {
    console.log("DATA CHANGE");

    state.arbiterBase.forEach(x => {
      const existingIndex = this.arbiters.findIndex(y => x._id === y._id);

      if (existingIndex !== -1) {
        this.arbiters[existingIndex] = {...x, editMode: this.arbiters[existingIndex]?.editMode ?? false};
      } else {
        this.arbiters = [...this.arbiters, {...x, editMode: false}];
      }
    });
    this.arbiters.sort((a, b) => a.name.localeCompare(b.name));

    state.doctorBase.forEach(x => {
      const existingIndex = this.doctors.findIndex(y => x._id === y._id);

      if (existingIndex !== -1) {
        this.doctors[existingIndex] = {...x, editMode: this.doctors[existingIndex]?.editMode ?? false};
      } else {
        this.doctors = [...this.doctors, {...x, editMode: false}];
      }
    });
    this.doctors.sort((a, b) => a.name.localeCompare(b.name));

    this.loading = false;
  }

  public getCorps(corpsId: string): Corps {
    return this.appState.corpsBase.find(c => c._id === corpsId);
  }

  protected addArbiter() {
    const now = DateTime.now();
    const newArbiter = {
      _id: "TMP" + Math.random() * 99999999,
      active: true,
      corpsId: "",
      createdAt: now,
      deleted: false,
      email: "",
      name: "",
      phone: "",
      updatedAt: now,
      editMode: true,
    };
    this.arbiters = [...this.arbiters, newArbiter];
  }

  protected saveArbiter(data: Arbiter) {
    const now = DateTime.now();
    data.editMode = false;

    if (data._id)
      this.arbiterService.update({
        ...data,
        updatedAt: now
      }).then(() => {
        this.arbiterService.load();
      });
    else {
      this.arbiters = this.arbiters.filter(a => a._id === data._id);
      this.arbiterService.insert(data).then(() => {
        this.arbiterService.load();
      });
    }
  }

  protected deleteArbiter(data: Arbiter, i) {
    this.arbiters = this.arbiters.filter(a => a._id !== data._id);
    this.arbiterService.delete(data).then(() => {
      this.arbiterService.load();
    });
  }

  protected addDoctor() {
    const now = DateTime.now();
    const newDoctor = {
      _id: "TMP" + Math.random() * 99999999,
      corpsId: this.appState.user.corpsId ?? null,
      deleted: false,
      email: "",
      external: false,
      name: "",
      phone: "",
      active: true,
      createdAt: now,
      updatedAt: now,
      editMode: true,
    };
    this.doctors = [...this.doctors, newDoctor];
  }

  protected saveDoctor(data: Doctor) {
    const now = DateTime.now();
    data.editMode = false;

    if (data._id)
      this.doctorService.update({
        ...data,
        updatedAt: now
      }).then(() => {
        this.doctorService.load();
      });
    else {
      this.doctors = this.doctors.filter(a => a._id === data._id);
      this.doctorService.insert(data).then(() => {
        this.doctorService.load();
      });
    }
  }

  protected deleteDoctor(data: Doctor, i) {
    this.doctors = this.doctors.filter(a => a._id !== data._id);
    this.doctorService.delete(data).then(() => {
      this.doctorService.load();
    });
  }
}
