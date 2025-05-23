import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoatOfArmsComponent } from './coat-of-arms.component';

describe('CoatOfArmsComponent', () => {
  let component: CoatOfArmsComponent;
  let fixture: ComponentFixture<CoatOfArmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoatOfArmsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoatOfArmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
