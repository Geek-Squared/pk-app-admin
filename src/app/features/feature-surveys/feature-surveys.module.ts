import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { FeatureSurveysRoutingModule } from './feature-surveys-routing.module';
import { ListSurveysComponent } from './list-surveys/list-surveys.component';
import { ViewSurveyComponent } from './view-survey/view-survey.component';
import { CreateSurveyModalComponent } from './create-survey-modal/create-survey-modal.component';

@NgModule({
  declarations: [ListSurveysComponent, ViewSurveyComponent, CreateSurveyModalComponent],
  imports: [CommonModule, FormsModule, RouterModule, ClarityModule, FeatureSurveysRoutingModule],
})
export class FeatureSurveysModule {}
