import { TestBed } from '@angular/core/testing';
import { ApplicationComponent } from './application.component';

describe('ApplicationComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(ApplicationComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'msc-frontend' title`, () => {
    const fixture = TestBed.createComponent(ApplicationComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('msc-frontend');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(ApplicationComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, msc-frontend');
  });
});
