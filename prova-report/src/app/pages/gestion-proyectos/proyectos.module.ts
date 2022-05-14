import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzModalModule, NzToolTipModule, NzButtonModule, NzFormModule, NzAlertModule, NzDropDownModule , NzSelectModule, NzPaginationModule } from 'ng-zorro-antd';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ProyectosRoutingModule } from './proyectos-routing.module';
import { ProyectosComponent } from './proyectos.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IconsProviderModule } from 'src/app/icons-provider.module';

@NgModule({
  imports: [
    CommonModule,
    ProyectosRoutingModule,
    IconsProviderModule,
    NzTableModule,
    NzModalModule,
    NzButtonModule,
    NzFormModule,
    NzAlertModule,
    NzToolTipModule,
    NzPaginationModule,
    NzDropDownModule,
    NzSelectModule,
    ReactiveFormsModule
  ],
  declarations: [ProyectosComponent],
  exports: [ProyectosComponent],
})
export class ProyectosModule {}
