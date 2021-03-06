import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzToolTipModule } from 'ng-zorro-antd';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IconsProviderModule } from './icons-provider.module';
import { SpinnerComponent } from './common/spinner/spinner.component';
import { httpInterceptorProviders } from './interceptors';
import { SpinnerService } from './common/spinner/spinner.service';
import { MatIconModule } from '@angular/material/icon';
import { UtilsService } from './common/UtilsService';



registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzToolTipModule,
    NzTableModule,
    NzAlertModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    HttpClientModule ,
    MatIconModule
  ],
  providers: [ httpInterceptorProviders, SpinnerService, { provide: NZ_I18N, useValue: en_US }, UtilsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
