import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerificacionDefectosComponent } from './verificacion-defectos.component';
import { VerificacionDefectosRoutingModule } from './verificacion-defectos-routing.module';
import { NzModalModule, NzTableModule, NzFormModule, NzPaginationModule, NzIconModule, NzButtonModule, NzSelectModule } from 'ng-zorro-antd';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { IconsProviderModule } from 'src/app/icons-provider.module';



@NgModule({
  declarations: [VerificacionDefectosComponent],
  imports: [
    CommonModule,
    NzModalModule,
    VerificacionDefectosRoutingModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    IconsProviderModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    NzTableModule,
    NzFormModule,
    NzButtonModule,
    NzSelectModule,
    NzPaginationModule,
    NzIconModule
  ],
  exports: [VerificacionDefectosComponent]
})
export class VerificacionDefectosModule { }
