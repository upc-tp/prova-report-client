import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', canActivate:[AuthGuard], pathMatch: 'full', redirectTo: '/dashboard' },
  {path: 'ejecucion-casos-pruebas', canActivate:[AuthGuard], loadChildren: () => import('./pages/ejecucion-casos-pruebas/ejecucion-casos-pruebas.module').then(m=>m.EjecucionCasosPruebasModule)},
  { path: 'dashboard', canActivate: [AuthGuard], loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'suite-pruebas', canActivate: [AuthGuard], loadChildren: () => import('./pages/suites-pruebas/suite.module').then(m => m.SuiteModule) },
  { path: 'gestion-proyectos', canActivate: [AuthGuard], loadChildren: () => import('./pages/gestion-proyectos/proyectos.module').then(m => m.ProyectosModule) },
  { path:'detalle-suite-pruebas', canActivate: [AuthGuard],loadChildren: () => import('./pages/detalle-suite-pruebas/detalle-suite-pruebas.module').then(m => m.DetalleSuiteModule)},
  { path: 'detalle-proyectos', canActivate: [AuthGuard], loadChildren: () => import('./pages/detalle-proyectos/detalle-proyectos.module').then(m => m.DetalleProyectosModule)},
  { path: 'Perfil', canActivate: [AuthGuard], loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule)},
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)},
  { path: 'register', loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule)},
  { path:'detalles-ejecucion', canActivate: [AuthGuard],loadChildren: () => import('./pages/detalle-ejecucion/detalle-ejecucion.module').then(m => m.DetalleEjecucionModule)},
  { path:'historias-usuario', canActivate: [AuthGuard],loadChildren: () => import('./pages/historias-usuario/historias-usuario.module').then(m => m.HistoriasUsuarioModule)},
  { path:'registrar-historia-usuario', canActivate: [AuthGuard],loadChildren: () => import('./pages/registrar-historia-usuario/registrar-historia-usuario.module').then(m => m.RegistrarHistoriaUsuarioModule)},
  { path: 'detalles-historia-usuario', canActivate: [AuthGuard],loadChildren: () => import('./pages/detalles-historia-usuario/detalles-historia-usuario.module').then(m => m.DetallesHistoriaUsuarioModule)},
  { path: 'plan-pruebas', canActivate: [AuthGuard], loadChildren: ()=> import('./pages/plans-pruebas/plan.module').then(m => m.PlanModule)},
  { path: 'gestion-defectos', canActivate: [AuthGuard], loadChildren: ()=> import('./pages/gestion-defectos/gestion-defectos.module').then(m => m.GestionDefectosModule)},
  // otherwise redirect to home
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
