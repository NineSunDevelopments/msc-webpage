import {Routes} from '@angular/router';
import {IndexComponent} from './pages/index/index.component';
import {InternComponent} from '@app/pages/intern/intern.component';
import {OverviewComponent} from '@app/pages/intern/overview/overview.component';
import {CorpsComponent} from '@app/pages/intern/corps/corps.component';
import {ReportsComponent} from '@app/pages/intern/reports/reports.component';
import {MscBallComponent} from '@app/pages/intern/msc-ball/msc-ball.component';
import {ActivitiesComponent} from '@app/pages/intern/activities/activities.component';
import {AdministrationComponent} from '@app/pages/intern/administration/administration.component';
import {SettingsComponent} from '@app/pages/intern/settings/settings.component';

export const routes: Routes = [
  {
    path: 'index',
    component: IndexComponent
  },
  {
    path: 'intern',
    component: InternComponent,
    children: [
      {
        path: 'overview',
        component: OverviewComponent,
      },
      {
        path: 'corps',
        component: CorpsComponent,
      },
      {
        path: 'corps/:id',
        component: CorpsComponent,
      },
      {
        path: 'corps/:id/edit',
        component: CorpsComponent,
      },
      {
        path: 'reports',
        component: ReportsComponent,
      },
      {
        path: 'msc-ball',
        component: MscBallComponent,
      },
      {
        path: 'activities',
        component: ActivitiesComponent,
      },
      {
        path: 'administration',
        component: AdministrationComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: '',
        redirectTo: '/intern/overview',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/index',
    pathMatch: 'full'
  }
];
