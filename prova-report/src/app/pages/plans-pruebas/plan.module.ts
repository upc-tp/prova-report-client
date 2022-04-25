import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NzModalModule, NzButtonModule, NzFormModule, NzAlertModule, NzSelectModule } from 'ng-zorro-antd';
import { NzTableModule } from 'ng-zorro-antd/table';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { PlanRoutingModule } from './plan-routing.module';
import { PlanComponent } from './plan.component';
import { DomSanitizer } from '@angular/platform-browser';

@NgModule({
  imports: [
    CommonModule,
    PlanRoutingModule,
    NzTableModule,
    NzModalModule,
    NzButtonModule,
    NzFormModule,
    NzAlertModule,
    IconsProviderModule,
    NzSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
  ],
  declarations: [PlanComponent],
  exports: [PlanComponent],
})
export class PlanModule {}