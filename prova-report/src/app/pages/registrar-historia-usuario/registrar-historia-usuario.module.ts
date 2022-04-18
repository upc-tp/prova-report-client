import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrarHistoriaUsuarioComponent } from './registrar-historia-usuario.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule, NzFormControlComponent, NzGridModule, NzIconModule } from 'ng-zorro-antd';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { RegistrarHistoriaUsuarioRoutingModule } from './registrar-historia-usuario-routing.module';
import { NgApexchartsModule } from 'ng-apexcharts';



@NgModule({
  declarations: [RegistrarHistoriaUsuarioComponent],
  imports: [
    CommonModule,
    RegistrarHistoriaUsuarioRoutingModule,
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
    NzIconModule
  ]
})
export class RegistrarHistoriaUsuarioModule { }
