import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UsersService, WorkbooksService } from 'src/app/services';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
})
export class ListUsersComponent implements OnInit, AfterViewChecked {
  public users: any[] = [];
  public filteredUsers: any[] = [];
  public workbookMap: Record<string, any> = {};
  public isLoading = false;
  public searchTerm = '';
  public page = 1;
  public readonly pageSize = 10;

  constructor(private usersService: UsersService, private workbooksService: WorkbooksService, private cdr: ChangeDetectorRef) {}
  ngAfterViewChecked() { this.cdr.detectChanges(); }

  ngOnInit(): void {
    this.isLoading = true;
    this.workbooksService.getWorkbooks().subscribe((data: any[]) => {
      data.forEach((e: any) => {
        const wb = e.payload.doc.data();
        if (wb?.uid) this.workbookMap[wb.uid] = wb;
      });
    });
    this.usersService.getUsers().subscribe(
      (data) => {
        this.users = data.map((e: any) => ({ id: e.payload.doc.id, ...e.payload.doc.data() }));
        this.applyFilter();
        this.isLoading = false;
      },
      () => { this.isLoading = false; }
    );
  }

  onSearchTermChange(value: string) { this.searchTerm = value; this.page = 1; this.applyFilter(); }

  private applyFilter() {
    const term = (this.searchTerm || '').trim().toLowerCase();
    this.filteredUsers = term
      ? this.users.filter(u =>
          (u.displayName || '').toLowerCase().includes(term) ||
          (u.email || '').toLowerCase().includes(term))
      : [...this.users];
  }

  getWorkbook(uid: string) { return this.workbookMap[uid]; }

  getProgress(uid: string): number {
    const wb = this.workbookMap[uid];
    if (!wb) return 0;
    const completed = Object.keys(wb.completedChapters || {}).length;
    const total = wb.totalChapterCount || completed || 0;
    return total ? Math.round((completed / total) * 100) : completed > 0 ? 100 : 0;
  }

  get pagedUsers(): any[] { const s = (this.page - 1) * this.pageSize; return this.filteredUsers.slice(s, s + this.pageSize); }
  get totalPages(): number { return Math.max(1, Math.ceil(this.filteredUsers.length / this.pageSize)); }
  get pageFrom(): number { return this.filteredUsers.length ? (this.page - 1) * this.pageSize + 1 : 0; }
  get pageTo(): number { return Math.min(this.page * this.pageSize, this.filteredUsers.length); }
}
