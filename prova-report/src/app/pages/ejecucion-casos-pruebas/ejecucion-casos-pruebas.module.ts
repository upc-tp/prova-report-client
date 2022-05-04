import { NgModule } from "@angular/core";
import { EjecucionCasosPruebasComponent } from './ejecucion-casos-pruebas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { EjecucionCasosPruebasRoutingModule } from './ejecucion-casos-pruebas-routing.module';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { NzButtonModule, NzFormModule, NzModalModule, NzSelectModule } from 'ng-zorro-antd';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';

@NgModule({
imports:[
FormsModule,
CommonModule,
MatSelectModule,
MatInputModule,
MatTableModule,
MatButtonModule,
EjecucionCasosPruebasRoutingModule,
ReactiveFormsModule,
MatFormFieldModule,
MatIconModule,
MatPaginatorModule,
MatSortModule,
NzButtonModule,
NzIconModule,
NzModalModule,
NzFormModule,
NzButtonModule,
NzSelectModule,
NzTableModule
],
declarations: [EjecucionCasosPruebasComponent],
exports: [EjecucionCasosPruebasComponent],
})
export class EjecucionCasosPruebasModule{}