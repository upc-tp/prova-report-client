import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzModalModule, NzButtonModule, NzFormModule, NzAlertModule, NzDropDownModule , NzSelectModule, NzPaginationModule } from 'ng-zorro-antd';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ProyectosRoutingModule } from './proyectos-routing.module';
import { ProyectosComponent } from './proyectos.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ProyectosRoutingModule,
    NzTableModule,
    NzModalModule,
    NzButtonModule,
    NzFormModule,
    NzAlertModule,
    NzPaginationModule,
    NzDropDownModule,
    NzSelectModule,
    ReactiveFormsModule
  ],
  declarations: [ProyectosComponent],
  exports: [ProyectosComponent],
})
export class ProyectosModule {}