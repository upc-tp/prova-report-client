import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule, NzModalModule, NzButtonModule, NzSelectModule } from 'ng-zorro-antd';
import { NzTableModule } from 'ng-zorro-antd/table';
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
    NzModalModule
  ],
  declarations: [DetalleSuitePruebasComponent],
  exports: [DetalleSuitePruebasComponent],
})

export class DetalleSuiteModule{}