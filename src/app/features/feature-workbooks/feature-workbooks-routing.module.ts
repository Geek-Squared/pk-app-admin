import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListUsersComponent } from './list-users/list-users.component';
import { ViewWorkbookComponent } from './view-workbook/view-workbook.component';

const routes: Routes = [
  { path: '', component: ListUsersComponent },
  { path: 'view-details/:userUid', component: ViewWorkbookComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeatureWorkbooksRoutingModule {}
