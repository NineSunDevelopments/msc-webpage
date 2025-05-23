import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { ApplicationComponent } from './app/components/application/application.component';

bootstrapApplication(ApplicationComponent, appConfig)
  .catch((err) => console.error(err));
