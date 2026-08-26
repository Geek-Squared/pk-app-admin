import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { FeatureSurveysRoutingModule } from './feature-surveys-routing.module';
import { ListSurveysComponent } from './list-surveys/list-surveys.component';
import { ViewSurveyComponent } from './view-survey/view-survey.component';
import { SurveyEditorModalComponent } from './survey-editor-modal/survey-editor-modal.component';

@NgModule({
  declarations: [ListSurveysComponent, ViewSurveyComponent, SurveyEditorModalComponent],
  imports: [CommonModule, FormsModule, RouterModule, ClarityModule, FeatureSurveysRoutingModule],
})
export class FeatureSurveysModule {}
