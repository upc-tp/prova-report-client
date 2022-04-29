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
import { NzModalModule, NzButtonModule, NzFormModule, NzAlertModule, NzSelectModule, NzIconModule } from 'ng-zorro-antd';
import { NzTableModule } from 'ng-zorro-antd/table';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { SuiteRoutingModule } from './suite-routing.module';
import { SuiteComponent } from './suite.component';

@NgModule({
  imports: [
    CommonModule,
    SuiteRoutingModule,
    NzTableModule,
    NzModalModule,
    NzButtonModule,
    NzFormModule,
    NzAlertModule,
    IconsProviderModule,
    NzSelectModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatOptionModule,
    FormsModule, 
    MatFormFieldModule, 
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    NzIconModule
  ],
  declarations: [SuiteComponent],
  exports: [SuiteComponent],
})
export class SuiteModule {}
