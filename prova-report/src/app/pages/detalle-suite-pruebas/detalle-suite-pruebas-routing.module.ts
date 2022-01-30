import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetalleSuitePruebasComponent } from './detalle-suite-pruebas.component';
const routes: Routes = [
    { path: '', component: DetalleSuitePruebasComponent },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class DetalleSuitePruebasRoutingModule { }