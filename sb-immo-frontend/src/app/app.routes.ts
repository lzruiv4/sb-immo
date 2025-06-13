import { Routes } from '@angular/router';
import { HomeLayoutComponent } from './layout/home-layout/home-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: HomeLayoutComponent,
    // children: [
    //   {
    //     path: 'property',
    //     component: PropertyComponent,
    //   },
    //   {
    //     path: 'contact',
    //     component: ContactComponent,
    //   },
    //   {
    //     path: 'pokeLotto',
    //     component: PokeLottoComponent,
    //   },
    // ],
  },
];
