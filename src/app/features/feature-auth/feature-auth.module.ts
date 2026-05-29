import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FeatureAuthRoutingModule } from './feature-auth-routing.module';
import { LoginComponent } from './login/login.component';
import { AuthUiModule } from '../../ui';


@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    FeatureAuthRoutingModule,
    AuthUiModule
  ]
})
export class FeatureAuthModule { }
