import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrarHistoriaUsuarioComponent } from './registrar-historia-usuario.component';
const routes: Routes = [
    { path: '', component: RegistrarHistoriaUsuarioComponent },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class RegistrarHistoriaUsuarioRoutingModule{ }