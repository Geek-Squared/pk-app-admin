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
import { AuthenticationService } from 'src/app/services';
import { ChatsService } from 'src/app/services/chats.service';

@Component({
  selector: 'app-group-chats',
  templateUrl: './group-chats.component.html',
  styleUrls: ['./group-chats.component.scss'],
})
export class GroupChatsComponent implements OnInit, AfterViewInit {
  @ViewChildren('messages') messages: QueryList<any>;
  @ViewChild('content') content: ElementRef;

  chat$: Observable<any>;
  newMsg: string;

  constructor(
    public cs: ChatsService,
    private route: ActivatedRoute,
    public auth: AuthenticationService
  ) {}

  ngOnInit() {
    this.chat$ = this.route.paramMap.pipe(
      switchMap(params => this.cs.joinUsers(this.cs.get(params.get('id'))))
    );
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
      return alert('Please enter a message');
    }
    this.cs.sendMessage(chat.id, this.newMsg, null, chat?.uids);
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
