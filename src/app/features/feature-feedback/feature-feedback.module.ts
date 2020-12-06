import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureFeedbackRoutingModule } from './feature-feedback-routing.module';
import { ListFeedbacksComponent } from './list-feedbacks/list-feedbacks.component';
import { ClarityModule } from '@clr/angular';

@NgModule({
  declarations: [ListFeedbacksComponent],
  imports: [CommonModule, FeatureFeedbackRoutingModule, ClarityModule],
})
export class FeatureFeedbackModule {}
