import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule, NzModalModule, NzButtonModule, NzSelectModule, NzTableModule, NzIconModule } from 'ng-zorro-antd';
import { DetallesEjecucionCasoPruebaComponent } from './detalles-ejecucion-caso-prueba.component';
import { DetallesEjecucionCasoPruebaRoutingModule } from './detalles-ejecucion-caso-prueba-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
    imports: [
      CommonModule,
      NzTableModule,
      DetallesEjecucionCasoPruebaRoutingModule,
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
    ],
    declarations: [DetallesEjecucionCasoPruebaComponent],
    exports: [DetallesEjecucionCasoPruebaComponent],
  })

  export class DetallesEjecucionCasoPruebaModule{}