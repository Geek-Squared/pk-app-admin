import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListChaptersComponent } from '../feature-chapters/list-chapters/list-chapters.component';
import { ViewChapterComponent } from '../feature-chapters/view-chapter/view-chapter.component';
import { ListInterventionsComponent } from './list-interventions/list-interventions.component';
import { ViewInterventionComponent } from './view-intervention/view-intervention.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: ListInterventionsComponent },
  {
    path: 'view-intervention/:interventionId',
    children: [
      { path: '', component: ViewInterventionComponent },
      { path: 'view-chapter/:chapterId', component: ViewChapterComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeatureInterventionsRoutingModule {}
