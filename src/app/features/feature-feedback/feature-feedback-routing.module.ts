import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListFeedbacksComponent } from './list-feedbacks/list-feedbacks.component';

const routes: Routes = [{ path: '', component: ListFeedbacksComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeatureFeedbackRoutingModule {}
