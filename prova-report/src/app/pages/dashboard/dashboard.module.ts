import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [CommonModule, DashboardRoutingModule, NgApexchartsModule, NzGridModule],
  declarations: [DashboardComponent],
  exports: [DashboardComponent]
})
export class DashboardModule { }
