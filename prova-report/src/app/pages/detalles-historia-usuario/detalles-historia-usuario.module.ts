import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetallesHistoriaUsuarioComponent } from './detalles-historia-usuario.component';
import { DetallesHistoriaUsuarioRoutingModule } from './detalles-historia-usuario-routing.module';
import { NzButtonModule, NzFormModule, NzIconModule, NzModalModule, NzSelectModule, NzTableModule } from 'ng-zorro-antd';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [DetallesHistoriaUsuarioComponent],
  imports: [
    CommonModule,
    NzTableModule,
    DetallesHistoriaUsuarioRoutingModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatTableModule,
    MatSelectModule,
    NzFormModule,
    NzButtonModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzModalModule,
    NzIconModule
  ]
})
export class DetallesHistoriaUsuarioModule { }
