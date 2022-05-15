import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetalleEjecucionComponent } from './detalle-ejecucion.component';
import { DetalleEjecucionRoutingModule } from './detalle-ejecucion-routing.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { MatIconModule } from '@angular/material/icon';
import { NzModalModule, NzFormModule, NzSelectModule, NzButtonModule, NzInputModule } from 'ng-zorro-antd';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [DetalleEjecucionComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DetalleEjecucionRoutingModule,
    NzTableModule,
    NzModalModule,
    MatFormFieldModule,
    MatButtonModule,
    NzFormModule,
    NzSelectModule,
    NzButtonModule,
    NzFormModule,
    MatIconModule,
    NzButtonModule,
    NzInputModule
  ]
})
export class DetalleEjecucionModule { }
