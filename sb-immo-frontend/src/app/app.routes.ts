import { Routes } from '@angular/router';
import { HomeLayoutComponent } from './layout/home-layout/home-layout.component';
import { ContactComponent } from './components/contact/contact.component';
import { PropertyComponent } from './components/property/property.component';
import { PropertyRecordComponent } from './components/property-record/property-record.component';
import { HeroComponent } from './layout/hero/hero.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      { path: '', component: HeroComponent },
      {
        path: 'contact',
        component: ContactComponent,
      },
      {
        path: 'property',
        component: PropertyComponent,
      },
      {
        path: 'propertyRecord',
        component: PropertyRecordComponent,
      },
    ],
  },
];
