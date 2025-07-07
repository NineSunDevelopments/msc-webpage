import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorpsSelectorComponent } from './corps-selector.component';

describe('CorpsSelectorComponent', () => {
  let component: CorpsSelectorComponent;
  let fixture: ComponentFixture<CorpsSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorpsSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorpsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
