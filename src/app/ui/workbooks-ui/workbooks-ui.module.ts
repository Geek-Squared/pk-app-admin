import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkbooksPostsListComponent } from './workbooks-posts-list/workbooks-posts-list.component';
import { WorkbookDetailsComponent } from './workbook-details/workbook-details.component';
import { ClarityModule } from '@clr/angular';

@NgModule({
  declarations: [WorkbooksPostsListComponent, WorkbookDetailsComponent],
  imports: [CommonModule, ClarityModule],
  exports: [WorkbooksPostsListComponent, WorkbookDetailsComponent],
})
export class WorkbooksUiModule {}
