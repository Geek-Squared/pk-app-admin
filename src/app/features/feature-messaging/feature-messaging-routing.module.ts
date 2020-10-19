import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MessagesComponent } from './messages/messages.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  { path: '', component: MessagesComponent },
  { path: 'chats/:id', component: ChatComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureMessagingRoutingModule { }
