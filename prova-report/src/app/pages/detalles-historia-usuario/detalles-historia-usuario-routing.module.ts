import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetallesHistoriaUsuarioComponent } from './detalles-historia-usuario.component';
const routes: Routes = [
    { path: '', component: DetallesHistoriaUsuarioComponent },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class DetallesHistoriaUsuarioRoutingModule{ }