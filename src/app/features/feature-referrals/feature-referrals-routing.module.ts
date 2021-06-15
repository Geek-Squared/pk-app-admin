import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListReferralsComponent } from './list-referrals/list-referrals.component';

const routes: Routes = [{ path: '', component: ListReferralsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeatureReferralsRoutingModule {}
