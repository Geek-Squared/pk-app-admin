import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureMessagingRoutingModule } from './feature-messaging-routing.module';
import { MessagesComponent } from './messages/messages.component';
import { ChatComponent } from './chat/chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import { CreateGroupChatComponent } from './create-group-chat/create-group-chat.component';
import { GroupChatsComponent } from './group-chats/group-chats.component'

@NgModule({
  declarations: [MessagesComponent, ChatComponent, CreateGroupChatComponent, GroupChatsComponent],
  imports: [
    CommonModule,
    FeatureMessagingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ClarityModule
  ],
})
export class FeatureMessagingModule {}
