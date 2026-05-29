import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListSurveysComponent } from './list-surveys/list-surveys.component';
import { ViewSurveyComponent } from './view-survey/view-survey.component';

const routes: Routes = [
  { path: '', component: ListSurveysComponent },
  { path: 'view/:id', component: ViewSurveyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureSurveysRoutingModule { }
