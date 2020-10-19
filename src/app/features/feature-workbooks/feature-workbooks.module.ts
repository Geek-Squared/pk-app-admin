import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureWorkbooksRoutingModule } from './feature-workbooks-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { ListUsersComponent } from './list-users/list-users.component';

@NgModule({
  declarations: [ListUsersComponent],
  imports: [
    CommonModule,
    FeatureWorkbooksRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ClarityModule,
  ],
})
export class FeatureWorkbooksModule {}
