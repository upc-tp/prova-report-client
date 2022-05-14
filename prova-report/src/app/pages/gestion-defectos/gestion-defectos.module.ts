import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionDefectosComponent } from './gestion-defectos.component';
import { NzTabsModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NzFormModule, NzModalModule, NzButtonModule, NzSelectModule, NzTableModule, NzIconModule, NzAlertModule, NzPaginationModule } from 'ng-zorro-antd';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { MatOptionModule } from '@angular/material/core';
import { GestionDefectosRoutingModule } from './gestion-defectos-routing.module';




@NgModule({
  declarations: [GestionDefectosComponent],
  imports: [
    CommonModule,
    NzTabsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    NzModalModule,
    IconsProviderModule,
    NzTableModule,
    NzButtonModule,
    FormsModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    NzFormModule,
    NzAlertModule,
    NzSelectModule,
    NzPaginationModule,
    MatOptionModule,
    GestionDefectosRoutingModule
  ]
})
export class GestionDefectosModule { }
