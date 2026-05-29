import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService, UsersService } from 'src/app/services';
import { ChatsService } from 'src/app/services/chats.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, OnDestroy {
  public allChats: any[] = [];
  public individualChats: any[] = [];
  public groupChats: any[] = [];
  public activeTab: 'direct' | 'groups' = 'direct';
  public isCreateGroup = false;
  public isLoading = false;
  public searchTerm = '';

  private chatsSub?: Subscription;
  private groupChatsSub?: Subscription;
  private userSub?: Subscription;
  private usersSub?: Subscription;
  public currentUser: any;
  public userNames: Record<string, string> = {};

  constructor(
    public auth: AuthenticationService,
    public cs: ChatsService,
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoading = true;

    this.userSub = this.auth.user$.subscribe(u => { this.currentUser = u; });

    this.usersSub = this.usersService.getUsers().subscribe((data: any[]) => {
      const map: Record<string, string> = {};
      data.forEach((e: any) => {
        const u: any = e.payload.doc.data();
        map[e.payload.doc.id] = u?.displayName || u?.email;
      });
      this.userNames = map;
    });

    this.chatsSub = this.cs.getAllChats().subscribe(
      (chats) => {
        this.individualChats = this.sortByLatest((chats || []).filter((c: any) => c.type !== 'group'));
        this.isLoading = false;
      },
      () => { this.isLoading = false; }
    );

    this.groupChatsSub = this.cs.getAllGroupChats().subscribe(chats => {
      this.groupChats = this.sortByLatest(chats || []);
    });
  }

  private latestAt(chat: any): number {
    const msgs = Array.isArray(chat?.messages) ? chat.messages : [];
    const lastMsgAt = msgs.reduce((m: number, msg: any) => Math.max(m, this.toMillis(msg?.createdAt)), 0);
    return Math.max(lastMsgAt, this.toMillis(chat?.updatedAt), this.toMillis(chat?.createdAt));
  }

  private sortByLatest(chats: any[]): any[] {
    return [...chats].sort((a, b) => this.latestAt(b) - this.latestAt(a));
  }

  private toMillis(value: any): number {
    if (!value) { return 0; }
    if (typeof value === 'number') { return value; }
    if (typeof value.toMillis === 'function') { return value.toMillis(); }
    if (typeof value.seconds === 'number') { return value.seconds * 1000; }
    return 0;
  }

  messageCount(chat: any): number {
    return Array.isArray(chat?.messages) ? chat.messages.length : 0;
  }

  unreadCount(chat: any): number {
    const me = this.currentUser?.uid || this.auth?.user?.uid;
    const msgs = Array.isArray(chat?.messages) ? chat.messages : [];
    const read = (me && chat?.hasRead?.[me]) || 0;
    // Only incoming (from the other person) messages beyond the read marker count.
    return msgs.slice(read).filter((m: any) => m?.uid && m.uid !== me).length;
  }

  lastMessageTime(chat: any): string {
    const at = this.latestAt(chat);
    if (!at) { return ''; }
    const d = new Date(at);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    if (sameDay) {
      return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    }
    const dayMs = 86400000;
    const days = Math.floor((now.getTime() - at) / dayMs);
    if (days < 7) { return `${days}d`; }
    return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  }

  ngOnDestroy() {
    this.chatsSub?.unsubscribe();
    this.groupChatsSub?.unsubscribe();
    this.userSub?.unsubscribe();
    this.usersSub?.unsubscribe();
  }

  private otherUid(chat: any): string | null {
    const me = this.currentUser?.uid || this.auth?.user?.uid;
    if (Array.isArray(chat?.uids)) {
      const other = chat.uids.find((u: any) => typeof u === 'string' && u !== me);
      if (other) { return other; }
    }
    if (chat?.uid && chat.uid !== me) { return chat.uid; }
    if (chat?.recipientId && chat.recipientId !== me) { return chat.recipientId; }
    return null;
  }

  chatName(chat: any): string {
    const other = this.otherUid(chat);
    return (
      (other && this.userNames[other]) ||
      chat?.displayName ||
      chat?.recipientName ||
      'Unknown user'
    );
  }

  get canCreateGroup(): boolean {
    const role = this.currentUser?.role;
    return role === 'Administrator' || role === 'Counsellor';
  }

  get filteredIndividual(): any[] {
    const list = this.individualChats.filter(c => this.matchesTerm(c));
    // One chat per participant: collapse duplicate threads, keeping the most
    // recent (individualChats is already sorted latest-first).
    const seen = new Set<string>();
    const deduped: any[] = [];
    for (const c of list) {
      const key = this.otherUid(c) || c.id;
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      deduped.push(c);
    }
    return deduped;
  }

  get filteredGroups(): any[] {
    return this.groupChats.filter(c => this.matchesTerm(c));
  }

  private matchesTerm(chat: any): boolean {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return true;
    const name = (this.chatName(chat) || '').toLowerCase();
    const msgs = Array.isArray(chat?.messages) ? chat.messages : [];
    return name.includes(term) || msgs.some((m: any) => (m?.content || '').toLowerCase().includes(term));
  }

  openChat(id: string) { this.router.navigate(['/messages/chats', id]); }
  openGroup(id: string) { this.router.navigate(['/messages/group-chats', id]); }

  getInitials(name: string) {
    return name ? name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase() : '?';
  }

  getAvatarColor(i: number) {
    const colors = ['#2D6CA8', '#2E9E86', '#6B53A8', '#C0832B', '#C25340'];
    return colors[i % colors.length];
  }

  getLastMessage(chat: any): string {
    const msgs = Array.isArray(chat?.messages) ? chat.messages : [];
    return msgs.length ? msgs[msgs.length - 1]?.content || '' : 'No messages yet';
  }
}
