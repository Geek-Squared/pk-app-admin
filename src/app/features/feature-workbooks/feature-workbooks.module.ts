import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureWorkbooksRoutingModule } from './feature-workbooks-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { ListUsersComponent } from './list-users/list-users.component';
import { ViewWorkbookComponent } from './view-workbook/view-workbook.component';
import { WorkbooksUiModule } from '../../ui/workbooks-ui/workbooks-ui.module';

@NgModule({
  declarations: [ListUsersComponent, ViewWorkbookComponent],
  imports: [
    CommonModule,
    FeatureWorkbooksRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ClarityModule,
    WorkbooksUiModule,
  ],
})
export class FeatureWorkbooksModule {}
