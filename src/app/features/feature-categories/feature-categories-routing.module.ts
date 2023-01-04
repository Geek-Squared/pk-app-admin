import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeatureCategoriesComponent } from './feature-categories.component';
import { ViewCategoryComponent } from './view-category/view-category.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeatureCategoriesRoutingModule {}
