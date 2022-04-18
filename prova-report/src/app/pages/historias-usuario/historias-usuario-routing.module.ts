import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HistoriasUsuarioComponent } from './historias-usuario.component';
const routes: Routes = [
    { path: '', component: HistoriasUsuarioComponent },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class HistoriasUsuarioRoutingModule{ }