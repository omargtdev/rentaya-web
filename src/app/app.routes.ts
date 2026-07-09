import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile').then(m => m.ProfileComponent)
  },
  {
    path: 'properties',
    loadComponent: () =>
      import('./pages/properties/properties-list/properties-list').then(m => m.PropertiesListComponent)
  },
  {
    path: 'properties/new',
    loadComponent: () =>
      import('./pages/properties/property-form/property-form').then(m => m.PropertyFormComponent)
  },
  {
    path: 'properties/:id/edit',
    loadComponent: () =>
      import('./pages/properties/property-form/property-form').then(m => m.PropertyFormComponent)
  },
  {
    path: 'properties/:id',
    loadComponent: () =>
      import('./pages/properties/property-detail/property-detail').then(m => m.PropertyDetailComponent)
  },
  {
    path: 'favorites',
    loadComponent: () => import('./pages/favorites/favorites').then(m => m.FavoritesComponent)
  },
  {
    path: 'visits',
    loadComponent: () =>
      import('./pages/visits/visit-requests/visit-requests').then(m => m.VisitRequestsComponent)
  },
  {
    path: 'messages',
    loadComponent: () => import('./pages/messages/messages').then(m => m.MessagesComponent)
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
