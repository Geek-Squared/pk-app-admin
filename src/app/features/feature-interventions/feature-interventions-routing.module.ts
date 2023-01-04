import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewCategoryComponent } from '../feature-categories/view-category/view-category.component';
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
      {
        path: 'view-category/:categoryId',
        children: [
          { path: '', component: ViewCategoryComponent },
          {
            path: 'view-chapter/:chapterId',
            children: [{ path: '', component: ViewChapterComponent }],
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeatureInterventionsRoutingModule {}
