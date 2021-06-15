import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureReferralsRoutingModule } from './feature-referrals-routing.module';
import { CreateReferralComponent } from './create-referral/create-referral.component';
import { ListReferralsComponent } from './list-referrals/list-referrals.component';
import { UpdateReferralComponent } from './update-referral/update-referral.component';
import { ClarityModule } from '@clr/angular';
import { ReferralsUiModule } from '../../ui/referrals-ui/referrals-ui.module';

@NgModule({
  declarations: [
    CreateReferralComponent,
    ListReferralsComponent,
    UpdateReferralComponent,
  ],
  imports: [
    CommonModule,
    FeatureReferralsRoutingModule,
    ReferralsUiModule,
    ClarityModule,
  ],
})
export class FeatureReferralsModule {}
