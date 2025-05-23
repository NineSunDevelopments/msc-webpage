import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBodyComponent } from './dialog-body.component';


xdescribe('DialogBodyComponent', () => {
  let component: DialogBodyComponent;
  let fixture: ComponentFixture<DialogBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogBodyComponent ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
