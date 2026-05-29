import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureCategoriesRoutingModule } from './feature-categories-routing.module';
import { FeatureCategoriesComponent } from './feature-categories.component';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { UpdateCategoryComponent } from './update-category/update-category.component';
import { DeleteCategoryComponent } from './delete-category/delete-category.component';
import { ViewCategoryComponent } from './view-category/view-category.component';
import { FeatureInterventionsModule } from '../feature-interventions/feature-interventions.module';
import { ClarityModule } from '@clr/angular';
import { CategoriesUiModule } from '../../ui/categories-ui/categories-ui.module';
import { SharedUiModule } from '../../ui/shared-ui/shared-ui.module';
import { FeatureChaptersModule } from '../feature-chapters/feature-chapters.module';

@NgModule({
  declarations: [
    FeatureCategoriesComponent,
    CreateCategoryComponent,
    UpdateCategoryComponent,
    DeleteCategoryComponent,
    ViewCategoryComponent,
  ],
  imports: [
    CommonModule,
    FeatureCategoriesRoutingModule,
    ClarityModule,
    CategoriesUiModule,
    SharedUiModule,
    FeatureChaptersModule,
  ],
  exports: [
    FeatureCategoriesComponent,
    CreateCategoryComponent,
    UpdateCategoryComponent,
    DeleteCategoryComponent,
    ViewCategoryComponent,
  ],
})
export class FeatureCategoriesModule {}
