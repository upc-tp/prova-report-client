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
import { NzFormModule, NzModalModule, NzButtonModule, NzSelectModule, NzTableModule, NzIconModule, NzAlertModule, NzPaginationModule } from 'ng-zorro-antd';
import { IconsProviderModule } from 'src/app/icons-provider.module';
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
      NzModalModule,
      IconsProviderModule,
      NzTableModule,
      NzButtonModule,
      FormsModule,
      CommonModule,
      MatSelectModule,
      MatInputModule,
      MatTableModule,
      MatButtonModule,
      NzFormModule,
      NzAlertModule,
      NzPaginationModule,
    ],
    declarations: [ValidacionBugsComponent],
    exports: [ValidacionBugsComponent],
  })

  export class ValidacionBugsModule{}