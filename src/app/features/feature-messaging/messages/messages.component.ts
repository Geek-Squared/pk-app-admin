import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services';
import { ChatsService } from 'src/app/services/chats.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, OnDestroy {
  public chats: any[] = [];
  public filteredChats: any[] = [];
  public groupChats$;
  public isCreateGroup: boolean;
  public isLoading = false;
  public searchTerm = '';
  private chatsSub?: Subscription;

  constructor(public auth: AuthenticationService, public cs: ChatsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.chatsSub = this.cs.getAllChats().subscribe(
      (chats) => {
        this.chats = chats || [];
        this.applyFilter();
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
    this.groupChats$ = this.cs.getAllGroupChats();
  }

  ngOnDestroy() {
    this.chatsSub?.unsubscribe();
  }

  onSearchTermChange(value: string) {
    this.searchTerm = value;
    this.applyFilter();
  }

  private applyFilter() {
    const term = (this.searchTerm || '').trim().toLowerCase();
    if (!term) {
      this.filteredChats = this.chats || [];
      return;
    }

    this.filteredChats = (this.chats || []).filter((chat) => {
      const name = (chat?.displayName || '').toString().toLowerCase();
      const messages = Array.isArray(chat?.messages) ? chat.messages : [];
      const messageMatch = messages.some((msg) =>
        (msg?.content || '').toString().toLowerCase().includes(term)
      );
      return name.includes(term) || messageMatch;
    });
  }

  getInitials(name: string) {
    return name ? name.substring(0, 1).toLocaleUpperCase() : 'O';
  }
}
