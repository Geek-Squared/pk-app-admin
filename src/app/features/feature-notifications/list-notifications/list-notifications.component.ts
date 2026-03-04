import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AdminNotificationsService } from 'src/app/services/admin-notifications.service';
import { Utilities } from 'src/app/models/utils';

@Component({
  selector: 'app-list-notifications',
  templateUrl: './list-notifications.component.html',
  styleUrls: ['./list-notifications.component.scss'],
})
export class ListNotificationsComponent implements OnInit, AfterViewChecked {
  public notifications: any[];
  public isLoading: boolean;
  public isSending: boolean;
  private uid: string | null = null;

  constructor(
    private notificationsService: AdminNotificationsService,
    private cdr: ChangeDetectorRef,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.afAuth.authState.subscribe((user) => {
      this.uid = user?.uid || null;
      this.notifications = this.filterUnread(this.notifications || []);
    });
    this.notificationsService.getNotifications().subscribe(
      (data) => {
        const mapped = data.map((e: any) => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data(),
          } as any;
        });
        this.notifications = this.filterUnread(mapped);

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  sendTestNotification(): void {
    if (this.isSending) {
      return;
    }

    this.isSending = true;
    this.notificationsService.sendTestNotification().subscribe(
      (result: any) => {
        this.isSending = false;
        const sent = result?.sent ?? 0;
        Utilities.displayToast(
          'success',
          `Test notification sent to ${sent} admin device(s).`
        );
      },
      (error) => {
        this.isSending = false;
        Utilities.displayToast('error', error?.message || 'Failed to send.');
      }
    );
  }

  public isRead(item: any): boolean {
    if (!this.uid) {
      return false;
    }
    return Boolean(item?.readBy && item.readBy[this.uid]);
  }

  public handleNotificationClick(item: any): void {
    if (!item) {
      return;
    }

    this.markAsRead(item);

    const userId = item?.userId;
    if (!userId) {
      return;
    }

    const queryParams: any = {};
    if (item?.workbookId) {
      queryParams.workbookId = item.workbookId;
    }
    if (item?.chapterId) {
      queryParams.chapterId = item.chapterId;
    }
    if (item?.postId) {
      queryParams.postId = item.postId;
    }

    this.notifications = (this.notifications || []).filter(
      (notification) => notification?.id !== item.id
    );

    this.router.navigate(['/work-books/view-details', userId], {
      queryParams,
    });
  }

  private markAsRead(item: any): void {
    if (!this.uid || !item?.id) {
      return;
    }

    if (!item.readBy) {
      item.readBy = {};
    }
    if (!item.readBy[this.uid]) {
      item.readBy[this.uid] = true;
    }

    this.notificationsService
      .markAsRead(item.id, this.uid as string)
      .catch(() => undefined);
  }

  private filterUnread(list: any[]): any[] {
    if (!this.uid || !Array.isArray(list)) {
      return list;
    }

    return list.filter(
      (item) => !item?.readBy || !item.readBy[this.uid as string]
    );
  }
}
