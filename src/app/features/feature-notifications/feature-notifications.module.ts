import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';

import { FeatureNotificationsRoutingModule } from './feature-notifications-routing.module';
import { ListNotificationsComponent } from './list-notifications/list-notifications.component';

@NgModule({
  declarations: [ListNotificationsComponent],
  imports: [CommonModule, FeatureNotificationsRoutingModule, ClarityModule],
})
export class FeatureNotificationsModule {}
