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
  public individualChats: any[] = [];
  public filteredIndividualChats: any[] = [];
  public groupChats: any[] = [];
  public filteredGroupChats: any[] = [];
  public isCreateGroup = false;
  public isLoading = false;
  public searchTerm = '';
  public currentUser: any;

  private chatsSub?: Subscription;
  private groupChatsSub?: Subscription;
  private userSub?: Subscription;

  constructor(public auth: AuthenticationService, public cs: ChatsService) {}

  ngOnInit() {
    this.isLoading = true;

    this.userSub = this.auth.user$.subscribe((user) => {
      this.currentUser = user;
    });

    this.chatsSub = this.cs.getAllChats().subscribe(
      (chats) => {
        this.individualChats = (chats || []).filter((c: any) => c.type !== 'group');
        this.applyFilter();
        this.isLoading = false;
      },
      () => { this.isLoading = false; }
    );

    this.groupChatsSub = this.cs.getAllGroupChats().subscribe((chats) => {
      this.groupChats = chats || [];
      this.applyFilter();
    });
  }

  ngOnDestroy() {
    this.chatsSub?.unsubscribe();
    this.groupChatsSub?.unsubscribe();
    this.userSub?.unsubscribe();
  }

  get canCreateGroup(): boolean {
    const role = this.currentUser?.role;
    return role === 'Administrator' || role === 'Counsellor';
  }

  onSearchTermChange(value: string) {
    this.searchTerm = value;
    this.applyFilter();
  }

  private applyFilter() {
    const term = (this.searchTerm || '').trim().toLowerCase();

    if (!term) {
      this.filteredIndividualChats = this.individualChats;
      this.filteredGroupChats = this.groupChats;
      return;
    }

    const matchChat = (chat: any) => {
      const name = (chat?.displayName || '').toLowerCase();
      const messages = Array.isArray(chat?.messages) ? chat.messages : [];
      return (
        name.includes(term) ||
        messages.some((m) => (m?.content || '').toLowerCase().includes(term))
      );
    };

    this.filteredIndividualChats = this.individualChats.filter(matchChat);
    this.filteredGroupChats = this.groupChats.filter(matchChat);
  }

  getInitials(name: string) {
    return name ? name.substring(0, 1).toLocaleUpperCase() : 'O';
  }
}
