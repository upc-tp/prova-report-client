import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
  { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'suite-pruebas', loadChildren: () => import('./pages/suites-pruebas/suite.module').then(m => m.SuiteModule) },
  { path: 'gestion-proyectos', loadChildren: () => import('./pages/gestion-proyectos/proyectos.module').then(m => m.ProyectosModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
