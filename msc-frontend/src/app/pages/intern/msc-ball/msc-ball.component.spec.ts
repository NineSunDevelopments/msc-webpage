import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MscBallComponent } from './msc-ball.component';

describe('MscBallComponent', () => {
  let component: MscBallComponent;
  let fixture: ComponentFixture<MscBallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MscBallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MscBallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
