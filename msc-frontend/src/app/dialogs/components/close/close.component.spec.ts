import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseComponent } from './close.component';


xdescribe('CloseComponent', () => {
  let component: CloseComponent;
  let fixture: ComponentFixture<CloseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseComponent ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
