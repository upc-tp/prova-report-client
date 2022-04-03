import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NzFormModule, NzModalModule, NzButtonModule, NzSelectModule, NzTableModule, NzIconModule } from 'ng-zorro-antd';
import { ValidacionBugsRoutingModule } from './validacion-bugs-routing.module';
import { ValidacionBugsComponent } from './validacion-bugs.component';

@NgModule({
    imports: [
      ValidacionBugsRoutingModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatIconModule,
      MatPaginatorModule,
      MatSortModule,
      FormsModule,
      CommonModule,
      MatSelectModule,
      MatInputModule,
      MatTableModule,
      MatButtonModule,
    ],
    declarations: [ValidacionBugsComponent],
    exports: [ValidacionBugsComponent],
  })

  export class ValidacionBugsModule{}