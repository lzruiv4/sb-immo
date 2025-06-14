import { Routes } from '@angular/router';
import { HomeLayoutComponent } from './layout/home-layout/home-layout.component';
import { ContactComponent } from './components/contact/contact.component';
import { ConnectionComponent } from './components/connection/connection.component';
import { PropertyComponent } from './components/property/property.component';

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
      {
        path: 'property',
        component: PropertyComponent,
      },
      {
        path: 'contact',
        component: ContactComponent,
      },
      {
        path: 'connection',
        component: ConnectionComponent,
      },
    ],
  },
];
