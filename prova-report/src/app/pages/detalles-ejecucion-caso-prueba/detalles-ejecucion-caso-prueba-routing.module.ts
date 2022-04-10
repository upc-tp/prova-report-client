import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetallesEjecucionCasoPruebaComponent } from './detalles-ejecucion-caso-prueba.component';
const routes: Routes = [
    { path: '', component: DetallesEjecucionCasoPruebaComponent },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class DetallesEjecucionCasoPruebaRoutingModule{ }