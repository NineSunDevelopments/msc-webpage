import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JudgesComponent } from './judges.component';

describe('FencingComponent', () => {
  let component: JudgesComponent;
  let fixture: ComponentFixture<JudgesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JudgesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JudgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
