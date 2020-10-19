import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureMessagingRoutingModule } from './feature-messaging-routing.module';
import { MessagesComponent } from './messages/messages.component';
import { ChatComponent } from './chat/chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ClarityModule} from '@clr/angular'

@NgModule({
  declarations: [MessagesComponent, ChatComponent],
  imports: [
    CommonModule,
    FeatureMessagingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ClarityModule
  ],
})
export class FeatureMessagingModule {}
