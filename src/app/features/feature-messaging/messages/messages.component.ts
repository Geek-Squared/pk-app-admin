import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services';
import { ChatsService } from 'src/app/services/chats.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  chats$;
  public groupChats$;
  public isCreateGroup: boolean;

  constructor(public auth: AuthenticationService, public cs: ChatsService) {}

  ngOnInit() {
    this.chats$ = this.cs.getAllChats();
    this.groupChats$ = this.cs.getAllGroupChats();
  }

  getInitials(name: string) {
    return name ? name.substring(0, 1).toLocaleUpperCase() : 'O';
  }
}
