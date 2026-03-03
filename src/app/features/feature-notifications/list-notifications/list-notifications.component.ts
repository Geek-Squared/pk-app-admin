import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
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

  constructor(
    private notificationsService: AdminNotificationsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.notificationsService.getNotifications().subscribe(
      (data) => {
        this.notifications = data.map((e: any) => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data(),
          } as any;
        });

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
}
