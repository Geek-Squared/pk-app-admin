import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListInterventionsComponent } from './list-interventions/list-interventions.component';
import { ViewInterventionComponent } from './view-intervention/view-intervention.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: ListInterventionsComponent },
  { path: 'view-intervention/:interventionId', component: ViewInterventionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureInterventionsRoutingModule { }
