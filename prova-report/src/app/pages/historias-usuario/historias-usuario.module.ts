import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoriasUsuarioComponent } from './historias-usuario.component';
import { HistoriasUsuarioRoutingModule } from './historias-usuario-routing.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NzAlertModule, NzButtonModule, NzFormModule, NzGridModule, NzIconModule, NzModalModule, NzSelectModule, NzTableModule, NzToolTipModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { IconsProviderModule } from 'src/app/icons-provider.module';



@NgModule({
  declarations: [HistoriasUsuarioComponent],
  imports: [
    CommonModule,
    HistoriasUsuarioRoutingModule,
    NgApexchartsModule, 
    NzGridModule, 
    FormsModule, 
    MatFormFieldModule, 
    MatButtonModule, 
    MatOptionModule, 
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NzButtonModule,
    NzToolTipModule,
    NzIconModule,
    NzFormModule,
    NzButtonModule,
    NzModalModule,
    NzTableModule,
    NzAlertModule,
    IconsProviderModule,
    NzSelectModule
  ]
})
export class HistoriasUsuarioModule { }
