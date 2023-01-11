import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyModule } from 'survey-angular-ui';

import { FeatureSurveysRoutingModule } from './feature-surveys-routing.module';
import { CreateSurveyComponent } from './create-survey/create-survey.component';

@NgModule({
  declarations: [CreateSurveyComponent],
  imports: [CommonModule, FeatureSurveysRoutingModule, SurveyModule],
})
export class FeatureSurveysModule {}
