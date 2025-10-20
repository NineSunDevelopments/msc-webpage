import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCorpsAccountDialogComponent } from './add-corps-account.dialog.component';


xdescribe('AddCorpsAccountDialogComponent', () => {
  let component: AddCorpsAccountDialogComponent;
  let fixture: ComponentFixture<AddCorpsAccountDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCorpsAccountDialogComponent ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCorpsAccountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
