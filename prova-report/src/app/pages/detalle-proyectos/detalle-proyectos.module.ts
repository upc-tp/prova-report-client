import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule, NzModalModule, NzButtonModule, NzSelectModule, NzTableModule, NzIconModule } from 'ng-zorro-antd';
import { DetalleProyectosRoutingModule } from './detalle-proyectos-routing.module';
import { DetalleProyectosComponent } from './detalle-proyectos.component';

@NgModule({
    imports: [
      CommonModule,
      NzTableModule,
      DetalleProyectosRoutingModule,
      NzFormModule,
      NzButtonModule,
      NzSelectModule,
      ReactiveFormsModule,
      NzModalModule,
      NzIconModule
    ],
    declarations: [DetalleProyectosComponent],
    exports: [DetalleProyectosComponent],
  })

  export class DetalleProyectosModule{}