import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzModalModule, NzButtonModule, NzFormModule, NzAlertModule } from 'ng-zorro-antd';
import { NzTableModule } from 'ng-zorro-antd/table';
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
    ReactiveFormsModule
  ],
  declarations: [SuiteComponent],
  exports: [SuiteComponent],
})
export class SuiteModule {}
