import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterRoutingModule } from './register-routing.module';
import { NzAlertModule, NzButtonModule, NzDropDownModule, NzFormModule, NzInputModule, NzModalModule, NzPaginationModule, NzSelectModule, NzTableModule } from 'ng-zorro-antd';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { RegisterComponent } from './register.component';



@NgModule({
  imports: [
    ReactiveFormsModule,
    RegisterRoutingModule,
    CommonModule,
    NzTableModule,
    NzModalModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzAlertModule,
    NzPaginationModule,
    NzDropDownModule,
    NzSelectModule,
    IconsProviderModule,
  ],
  declarations: [RegisterComponent],
  exports: [RegisterComponent]
})
export class RegisterModule { }
