import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NzFormModule, NzModalModule, NzButtonModule, NzSelectModule, NzTableModule, NzIconModule, NgZorroAntdModule, NzAlertModule } from 'ng-zorro-antd';
import { IconsProviderModule } from 'src/app/icons-provider.module';
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
      NzIconModule,
      NgZorroAntdModule,
      MatFormFieldModule,
      MatOptionModule,
      FormsModule, 
      MatButtonModule, 
      MatInputModule,
      MatIconModule,
      MatSelectModule,
      MatTableModule,
      MatPaginatorModule,
      MatSortModule,
      NzAlertModule,
      IconsProviderModule
    ],
    declarations: [DetalleProyectosComponent],
    exports: [DetalleProyectosComponent],
  })

  export class DetalleProyectosModule{}
