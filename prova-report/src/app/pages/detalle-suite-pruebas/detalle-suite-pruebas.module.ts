import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule, NzModalModule, NzButtonModule, NzSelectModule, NzTableModule, NzIconModule } from 'ng-zorro-antd';
import { DetalleSuitePruebasRoutingModule } from './detalle-suite-pruebas-routing.module';
import { DetalleSuitePruebasComponent } from './detalle-suite-pruebas.component';

@NgModule({
  imports: [
    CommonModule,
    NzTableModule,
    DetalleSuitePruebasRoutingModule,
    NzFormModule,
    NzButtonModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzModalModule,
    NzIconModule
  ],
  declarations: [DetalleSuitePruebasComponent],
  exports: [DetalleSuitePruebasComponent],
})

export class DetalleSuiteModule{}