import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services';
import { ChatsService } from 'src/app/services/chats.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  chats$;
  constructor(public auth: AuthenticationService, public cs: ChatsService) {}

  ngOnInit() {
    this.chats$ = this.cs.getAllChats();
  }
}