import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EjecucionCasosPruebasComponent } from './ejecucion-casos-pruebas.component';

const routes: Routes = [
  { path: '', component: EjecucionCasosPruebasComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EjecucionCasosPruebasRoutingModule { }