import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';

import { FeatureInterventionsRoutingModule } from './feature-interventions-routing.module';
import { InterventionsUiModule } from '../../ui/interventions-ui/interventions-ui.module';
import { SharedUiModule } from '../../ui/shared-ui/shared-ui.module';
import { CreateInterventionComponent } from './create-intervention/create-intervention.component';
import { UpdateInterventionComponent } from './update-intervention/update-intervention.component';
import { DeleteInterventionComponent } from './delete-intervention/delete-intervention.component';
import { ListInterventionsComponent } from './list-interventions/list-interventions.component';
import { ViewInterventionComponent } from './view-intervention/view-intervention.component';
import { FeatureChaptersModule } from '../feature-chapters/feature-chapters.module';
import { FeatureCategoriesModule } from '../feature-categories/feature-categories.module';

@NgModule({
  declarations: [
    CreateInterventionComponent,
    UpdateInterventionComponent,
    DeleteInterventionComponent,
    ListInterventionsComponent,
    ViewInterventionComponent,
  ],
  imports: [
    CommonModule,
    FeatureInterventionsRoutingModule,
    InterventionsUiModule,
    SharedUiModule,
    ClarityModule,
    FeatureChaptersModule,
    FeatureCategoriesModule,
  ],
  exports: [
    CreateInterventionComponent,
    UpdateInterventionComponent,
    DeleteInterventionComponent,
    ListInterventionsComponent,
    ViewInterventionComponent,
  ],
})
export class FeatureInterventionsModule {}
