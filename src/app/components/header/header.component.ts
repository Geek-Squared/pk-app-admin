import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AdminNotificationsService } from 'src/app/services/admin-notifications.service';

const TITLES: Record<string, string> = {
  interventions: 'Interventions',
  'work-books':  'Workbooks',
  surveys:       'Surveys',
  messages:      'Messages',
  users:         'Users',
  referrals:     'Referrals',
  feedback:      'Feedback',
  notifications: 'Notifications',
  categories:    'Categories',
  posts:         'Posts',
  chapters:      'Chapters',
};

const LAST_SEEN_KEY = 'notificationsLastSeen';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  pageTitle = 'Dashboard';
  search = '';
  hasUnreadNotifications = false;
  private latestNotificationAt = 0;

  constructor(
    public authService: AuthenticationService,
    private router: Router,
    private notificationsService: AdminNotificationsService
  ) {}

  ngOnInit(): void {
    this.updateTitle(this.router.url);
    if (this.router.url.split('/').filter(Boolean)[0] === 'notifications') {
      this.markNotificationsSeen();
    }

    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
      const url = e.urlAfterRedirects;
      this.updateTitle(url);
      if (url.split('/').filter(Boolean)[0] === 'notifications') {
        this.markNotificationsSeen();
      }
    });

    this.notificationsService.getNotifications().subscribe((docs: any[]) => {
      this.latestNotificationAt = (docs || []).reduce((latest, d: any) => {
        return Math.max(latest, this.toMillis(d?.payload?.doc?.data()?.createdAt));
      }, 0);
      this.refreshUnread();
    });
  }

  private markNotificationsSeen() {
    localStorage.setItem(LAST_SEEN_KEY, String(Math.max(this.latestNotificationAt, Date.now())));
    this.hasUnreadNotifications = false;
  }

  private refreshUnread() {
    const lastSeen = Number(localStorage.getItem(LAST_SEEN_KEY) || 0);
    this.hasUnreadNotifications = this.latestNotificationAt > lastSeen;
  }

  private toMillis(value: any): number {
    if (!value) { return 0; }
    if (typeof value === 'number') { return value; }
    if (typeof value.toMillis === 'function') { return value.toMillis(); }
    if (typeof value.seconds === 'number') { return value.seconds * 1000; }
    return 0;
  }

  private updateTitle(url: string) {
    const segment = url.split('/').filter(Boolean)[0] || '';
    this.pageTitle = TITLES[segment] || 'Dashboard';
  }
}
