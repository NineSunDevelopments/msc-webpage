import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { ApplicationComponent } from './app/components/application/application.component';


declare global {
  // Note the capital "W"
  interface Window {

    fitText: (el: HTMLOrSVGElement, factor: number) => void
  }
}

bootstrapApplication(ApplicationComponent, appConfig)
  .catch((err) => console.error(err));
