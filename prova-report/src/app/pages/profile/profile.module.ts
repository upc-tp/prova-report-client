import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzModalModule, NzButtonModule, NzFormModule, NzAlertModule, NzSelectModule } from 'ng-zorro-antd';
import { NzTableModule } from 'ng-zorro-antd/table';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    NzTableModule,
    NzModalModule,
    NzButtonModule,
    NzFormModule,
    NzAlertModule,
    IconsProviderModule,
    NzSelectModule,
    ReactiveFormsModule,
    NgZorroAntdModule
  ],
  declarations: [ProfileComponent],
  exports: [ProfileComponent],
})
export class ProfileModule {}
