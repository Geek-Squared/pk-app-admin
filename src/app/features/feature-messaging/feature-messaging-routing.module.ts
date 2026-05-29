import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MessagesComponent } from './messages/messages.component';
import { ChatComponent } from './chat/chat.component';
import { GroupChatsComponent } from './group-chats/group-chats.component';

const routes: Routes = [
  {
    path: '',
    component: MessagesComponent,
    children: [
      { path: 'chats/:id', component: ChatComponent },
      { path: 'group-chats/:id', component: GroupChatsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeatureMessagingRoutingModule {}
