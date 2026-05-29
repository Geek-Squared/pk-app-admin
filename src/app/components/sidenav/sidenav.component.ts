import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ChatsService } from 'src/app/services/chats.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Input() collapsed = false;
  @Output() toggle = new EventEmitter<void>();
  public messagesUnread = 0;

  readonly nav = [
    { group: 'Programme', items: [
      { route: '/interventions', label: 'Interventions', icon: 'layers' },
      { route: '/categories',   label: 'Categories',   icon: 'folder' },
      { route: '/work-books',   label: 'Workbooks',    icon: 'bookOpen' },
      { route: '/surveys',      label: 'Surveys',      icon: 'clipboard' },
    ]},
    { group: 'People', items: [
      { route: '/messages',     label: 'Messages',     icon: 'mail' },
      { route: '/users',        label: 'Users',        icon: 'users' },
      { route: '/referrals',    label: 'Referrals',    icon: 'share' },
      { route: '/feedback',     label: 'Feedback',     icon: 'chat' },
    ]},
    { group: 'System', items: [
      { route: '/notifications', label: 'Notifications', icon: 'bell' },
    ]},
  ];

  constructor(public auth: AuthenticationService, private cs: ChatsService) {}

  ngOnInit(): void {
    this.cs.getAllChats().subscribe((chats: any[]) => {
      const me = (this.auth.user as any)?.uid || JSON.parse(sessionStorage.getItem('user') || 'null')?.uid;
      this.messagesUnread = (chats || []).reduce((sum: number, c: any) => {
        const msgs = Array.isArray(c?.messages) ? c.messages : [];
        const read = (me && c?.hasRead?.[me]) || 0;
        // Only incoming messages (not ones this admin sent) count as unread.
        return sum + msgs.slice(read).filter((m: any) => m?.uid && m.uid !== me).length;
      }, 0);
    });
  }

  get userInitials(): string {
    const name = (this.auth.user as any)?.displayName || '';
    return name ? name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase() : 'PK';
  }

  get userName(): string {
    return (this.auth.user as any)?.displayName || 'Admin';
  }

  get userRole(): string {
    return JSON.parse(sessionStorage.getItem('user') || '{}')?.role || '';
  }
}
