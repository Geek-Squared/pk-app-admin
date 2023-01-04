import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureCategoriesRoutingModule } from './feature-categories-routing.module';
import { FeatureCategoriesComponent } from './feature-categories.component';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { UpdateCategoryComponent } from './update-category/update-category.component';
import { ViewCategoryComponent } from './view-category/view-category.component';
import { FeatureInterventionsModule } from '../feature-interventions/feature-interventions.module';
import { ClarityModule } from '@clr/angular';
import { CategoriesUiModule } from '../../ui/categories-ui/categories-ui.module';
import { FeatureChaptersModule } from '../feature-chapters/feature-chapters.module';

@NgModule({
  declarations: [
    FeatureCategoriesComponent,
    CreateCategoryComponent,
    UpdateCategoryComponent,
    ViewCategoryComponent,
  ],
  imports: [
    CommonModule,
    FeatureCategoriesRoutingModule,
    ClarityModule,
    CategoriesUiModule,
    FeatureChaptersModule,
  ],
  exports: [
    FeatureCategoriesComponent,
    CreateCategoryComponent,
    UpdateCategoryComponent,
    ViewCategoryComponent,
  ],
})
export class FeatureCategoriesModule {}
