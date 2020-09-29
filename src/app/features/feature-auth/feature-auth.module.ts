import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureAuthRoutingModule } from './feature-auth-routing.module';
import { LoginComponent } from './login/login.component';
import { AuthUiModule } from '../../ui';


@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FeatureAuthRoutingModule,
    AuthUiModule
  ]
})
export class FeatureAuthModule { }
