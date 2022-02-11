import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { NzAlertModule, NzButtonModule, NzDropDownModule, NzFormModule, NzModalModule, NzPaginationModule, NzSelectModule, NzTableModule } from 'ng-zorro-antd';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { LoginRoutingModule } from './login-routing.module';




@NgModule({
  imports: [
    ReactiveFormsModule,
    LoginRoutingModule,
    CommonModule,
    NzTableModule,
    NzModalModule,
    NzButtonModule,
    NzFormModule,
    NzAlertModule,
    NzPaginationModule,
    NzDropDownModule,
    NzSelectModule,
    IconsProviderModule
  ],
  declarations: [LoginComponent],
  exports: [LoginComponent]
})
export class LoginModule { }
