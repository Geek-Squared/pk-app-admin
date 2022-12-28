import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeatureCategoriesComponent } from './feature-categories.component';

const routes: Routes = [{ path: '', component: FeatureCategoriesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureCategoriesRoutingModule { }
