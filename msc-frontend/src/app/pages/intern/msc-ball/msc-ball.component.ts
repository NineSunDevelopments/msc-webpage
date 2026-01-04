import {Component, Injector} from '@angular/core';
import {LoadingComponent} from "@app/components/loading/loading.component";
import {BallTicketService} from '@app/services/ball-ticket/ball-ticket.service';
import {SmartComponent} from '@app/components/smart-component';
import {BallTickets} from '@shared/types/ball-tickets';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DateTime} from 'luxon';
import {MatInput} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'msc-msc-ball',
  imports: [
    LoadingComponent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInput,
    MatButton,
  ],
  templateUrl: './msc-ball.component.html',
  styleUrl: './msc-ball.component.scss'
})
export class MscBallComponent extends SmartComponent {

  public loading = false;
  public ballTicketEntries: BallTickets[] = [];
  public ballTicketRequests: BallTickets[] = [];
  public ballTicketOfferings: BallTickets[] = [];
  public ownEntry: BallTickets = null;

  public entryForm: FormGroup = new FormGroup({
    contactPerson: new FormControl(null, [Validators.required]),
    contactPhone: new FormControl(null, [Validators.required]),
    amount: new FormControl(null, [Validators.required]),
  });

  constructor(injector: Injector, private ballTicketService: BallTicketService) {
    super(injector)
  }

  public onInit(): void {
    this.loading = true;
    this.ballTicketService.loadForCurrentSemester().then((data) => {
      this.ballTicketEntries = data;
      this.ballTicketRequests = data.filter(x => x.amount < 0);
      this.ballTicketOfferings = data.filter(x => x.amount > 0);

      this.ownEntry = this.ballTicketEntries.find(x => x.corpsId === this.appState.user.corpsId);

      if (this.ownEntry) {
        this.entryForm.get('contactPerson').setValue(this.ownEntry.contactPerson);
        this.entryForm.get('contactPhone').setValue(this.ownEntry.contactPhone);
        this.entryForm.get('amount').setValue(this.ownEntry.amount);
      } else {
        this.entryForm.reset();
      }

      this.loading = false
    });
  }

  public addEntry() {
    this.ballTicketService.insert({
      corpsId: this.appState.user.corpsId,
      amount: this.entryForm.value.amount,
      contactPerson: this.entryForm.value.contactPerson,
      contactPhone: this.entryForm.value.contactPhone,
      semesterId: this.appState.currentSemester._id,
      deleted: false,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now()
    }).then(() => this.onInit());
  }

  public updateEntry() {
    this.ballTicketService.update({
      ...this.ownEntry,
      corpsId: this.appState.user.corpsId,
      amount: this.entryForm.value.amount,
      contactPerson: this.entryForm.value.contactPerson,
      contactPhone: this.entryForm.value.contactPhone,
      semesterId: this.appState.currentSemester._id,
      deleted: false,
      updatedAt: DateTime.now()
    }).then(() => this.onInit());
  }

  public deleteEntry() {
    this.ballTicketService.delete(this.ownEntry).then(() => this.onInit());
  }

  public getCorps(corpsId: string): string {
    return 'Corps ' + (this.appState.corpsBase.find(x => x._id === corpsId)?.name ?? '...');
  }

  public getOverview() {
    const overall = this.ballTicketEntries.reduce((acc, cur) => acc + cur.amount, 0);

    return overall > 0 ? `(Überschuss: ${overall})` : `(Mangel: ${overall * -1})`;
  }
}
