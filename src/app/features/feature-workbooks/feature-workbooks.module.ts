import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureWorkbooksRoutingModule } from './feature-workbooks-routing.module';
import { MessagesComponent } from './messages/messages.component';
import { ChatComponent } from './chat/chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [MessagesComponent, ChatComponent],
  imports: [
    CommonModule,
    FeatureWorkbooksRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class FeatureWorkbooksModule {}
