import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';

import { FeatureInterventionsRoutingModule } from './feature-interventions-routing.module';
import { InterventionsUiModule } from '../../ui/interventions-ui/interventions-ui.module';
import { CreateInterventionComponent } from './create-intervention/create-intervention.component';
import { UpdateInterventionComponent } from './update-intervention/update-intervention.component';
import { ListInterventionsComponent } from './list-interventions/list-interventions.component';
import { ViewInterventionComponent } from './view-intervention/view-intervention.component';
import { FeatureChaptersModule } from '../feature-chapters/feature-chapters.module';

@NgModule({
  declarations: [
    CreateInterventionComponent,
    UpdateInterventionComponent,
    ListInterventionsComponent,
    ViewInterventionComponent,
  ],
  imports: [
    CommonModule,
    FeatureInterventionsRoutingModule,
    InterventionsUiModule,
    ClarityModule,
    FeatureChaptersModule,
  ],
})
export class FeatureInterventionsModule {}
