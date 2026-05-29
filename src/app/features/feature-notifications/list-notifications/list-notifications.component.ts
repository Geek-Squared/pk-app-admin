import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminNotificationsService } from 'src/app/services/admin-notifications.service';
import { Utilities } from 'src/app/models/utils';

@Component({
  selector: 'app-list-notifications',
  templateUrl: './list-notifications.component.html',
  styleUrls: ['./list-notifications.component.scss'],
})
export class ListNotificationsComponent implements OnInit, AfterViewChecked {
  public notifications: any[] = [];
  public filteredNotifications: any[] = [];
  public isLoading = false;
  public isSending = false;
  public isBroadcasting = false;
  public searchTerm = '';
  public showModal = false;
  public target: 'all' | 'clients' | 'group' = 'all';
  public broadcastTitle = '';
  public broadcastBody = '';
  public page = 1;
  public readonly pageSize = 10;

  constructor(
    private notificationsService: AdminNotificationsService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  public isNavigable(item: any): boolean {
    return !!item?.userId && (item?.type === 'workbook_completed' || item?.type === 'chapter_completed');
  }

  public openNotification(item: any): void {
    if (!this.isNavigable(item)) {
      return;
    }
    this.router.navigate(['/work-books/view-details', item.userId]);
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.notificationsService.getNotifications().subscribe(
      (data) => {
        this.notifications = data.map((e: any) => ({ id: e.payload.doc.id, ...e.payload.doc.data() }));
        this.applyFilter();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      () => { this.isLoading = false; }
    );
  }

  ngAfterViewChecked() { this.cdr.detectChanges(); }

  onSearchTermChange(value: string) { this.searchTerm = value; this.page = 1; this.applyFilter(); }

  private applyFilter() {
    const term = (this.searchTerm || '').trim().toLowerCase();
    this.filteredNotifications = term
      ? this.notifications.filter(n =>
          (n.title || '').toLowerCase().includes(term) ||
          (n.message || '').toLowerCase().includes(term) ||
          (n.type || '').toLowerCase().includes(term))
      : [...this.notifications];
  }

  get pagedNotifications(): any[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredNotifications.slice(start, start + this.pageSize);
  }
  get totalPages(): number { return Math.max(1, Math.ceil(this.filteredNotifications.length / this.pageSize)); }
  get pageFrom(): number { return this.filteredNotifications.length ? (this.page - 1) * this.pageSize + 1 : 0; }
  get pageTo(): number { return Math.min(this.page * this.pageSize, this.filteredNotifications.length); }

  sendTestNotification(): void {
    if (this.isSending) return;
    this.isSending = true;
    this.notificationsService.sendTestNotification().subscribe(
      (r: any) => { this.isSending = false; Utilities.displayToast('success', `Test sent to ${r?.sent ?? 0} device(s).`); },
      (e) => { this.isSending = false; Utilities.displayToast('error', e?.message || 'Failed.'); }
    );
  }

  openModal(): void {
    this.target = 'all';
    this.broadcastTitle = '';
    this.broadcastBody = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  sendBroadcast(): void {
    if (!this.broadcastTitle.trim() || !this.broadcastBody.trim() || this.isBroadcasting) return;
    this.isBroadcasting = true;
    this.notificationsService.sendBroadcast(this.broadcastTitle.trim(), this.broadcastBody.trim()).subscribe(
      (r: any) => {
        this.isBroadcasting = false;
        this.showModal = false;
        this.broadcastTitle = '';
        this.broadcastBody = '';
        const audience = this.target === 'all' ? 'all users' : this.target === 'clients' ? 'clients' : 'selected group';
        Utilities.displayToast('success', `Notification sent to ${audience} (${r?.sent ?? 0} device(s)).`);
      },
      (e) => { this.isBroadcasting = false; Utilities.displayToast('error', e?.message || 'Failed.'); }
    );
  }
}
