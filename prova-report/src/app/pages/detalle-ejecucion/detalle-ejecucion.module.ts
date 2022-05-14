import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetalleEjecucionComponent } from './detalle-ejecucion.component';
import { DetalleEjecucionRoutingModule } from './detalle-ejecucion-routing.module';
import { NzTableModule } from 'ng-zorro-antd/table';



@NgModule({
  declarations: [DetalleEjecucionComponent],
  imports: [
    CommonModule,
    DetalleEjecucionRoutingModule,
    NzTableModule
  ]
})
export class DetalleEjecucionModule { }
