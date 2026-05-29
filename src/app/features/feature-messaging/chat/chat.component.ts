import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthenticationService, UsersService } from 'src/app/services';
import { ChatsService } from 'src/app/services/chats.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, AfterViewInit {
  @ViewChildren('messages') messages: QueryList<any>;
  @ViewChild('content') content: ElementRef;
  chat$: Observable<any>;
  otherUser: any = null;
  newMsg: string;

  constructor(
    public cs: ChatsService,
    private route: ActivatedRoute,
    public auth: AuthenticationService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.chat$ = this.route.paramMap.pipe(
      switchMap(params => this.cs.joinUsers(this.cs.get(params.get('id'))))
    );
    this.chat$.subscribe(chat => {
      this.loadOtherUser(chat);
      this.markChatRead(chat);
    });
  }

  private markChatRead(chat: any) {
    const me = this.auth?.user?.uid;
    if (!chat?.id || !me) { return; }
    const count = Array.isArray(chat?.messages) ? chat.messages.length : 0;
    // Only write when something is actually unread, to avoid an update loop.
    if ((chat?.hasRead?.[me] || 0) !== count) {
      this.cs.markRead(chat.id, me, count);
    }
  }

  private loadOtherUser(chat: any) {
    if (!chat) { this.otherUser = null; return; }
    const me = this.auth?.user?.uid;
    let otherUid: string | null = null;
    if (Array.isArray(chat.uids)) {
      otherUid = chat.uids.find((u: any) => typeof u === 'string' && u !== me) || null;
    }
    if (!otherUid && chat.uid && chat.uid !== me) otherUid = chat.uid;
    if (!otherUid && chat.recipientId && chat.recipientId !== me) otherUid = chat.recipientId;
    if (!otherUid) { this.otherUser = null; return; }
    this.usersService.getUserById(otherUid).subscribe((u: any) => { this.otherUser = u; });
  }

  get lastSeenText(): string {
    if (!this.otherUser) return 'Client';
    if (this.otherUser?.isOnline) return 'Client · online now';
    const raw = this.otherUser?.lastSeenAt;
    const millis = typeof raw === 'number' ? raw
      : (raw && typeof raw.toMillis === 'function') ? raw.toMillis()
      : null;
    if (!millis) return 'Client';
    const d = new Date(millis);
    const now = Date.now();
    const diffMs = now - millis;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Client · last seen just now';
    if (diffMin < 60) return `Client · last seen ${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `Client · last seen ${diffHr}h ago`;
    return `Client · last seen ${d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}`;
  }

  ngAfterViewInit() {
    this.scrollToBottom();
    this.messages.changes.subscribe(this.scrollToBottom);
  }

  scrollToBottom = () => {
    try {
      this.content.nativeElement.scrollTop =
        this.content.nativeElement.scrollHeight;
    } catch (err) {}
  };

  submit(chat) {
    if (!this.newMsg) {
      return alert('you need to enter something');
    }

    this.cs.sendMessage(
      chat.id,
      this.newMsg,
      this.otherUser?.uid,
      chat?.members
    );
    this.newMsg = '';
  }

  trackByCreated(i, msg) { return msg.createdAt; }
  trackByIndex(i: number) { return i; }

  handleEnter(event: KeyboardEvent, chat: any) {
    if (!event.shiftKey) {
      event.preventDefault();
      this.submit(chat);
    }
  }
}
