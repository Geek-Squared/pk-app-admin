import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UsersService, WorkbooksService } from 'src/app/services';
import { ChaptersService } from 'src/app/services/chapters.service';

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

  /** Curriculum size — the denominator for everyone's progress. */
  public totalChapters = 0;

  constructor(
    private usersService: UsersService,
    private workbooksService: WorkbooksService,
    private chaptersService: ChaptersService,
    private cdr: ChangeDetectorRef
  ) {}
  ngAfterViewChecked() { this.cdr.detectChanges(); }

  ngOnInit(): void {
    this.isLoading = true;
    this.chaptersService.getChapters().subscribe((data: any[]) => {
      this.totalChapters = data.length;
    });
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
    // `totalChapterCount` is read here and on the detail page but written by
    // nothing, so the old fallback to `completed` made every client with a
    // single finished chapter read 100%. The curriculum size is the real
    // denominator — the same one the detail page already falls back to.
    const total = wb.totalChapterCount || this.totalChapters;
    return total ? Math.round(Math.min(completed / total, 1) * 100) : 0;
  }

  completedChapterCount(uid: string): number {
    return Object.keys(this.workbookMap[uid]?.completedChapters || {}).length;
  }

  get pagedUsers(): any[] { const s = (this.page - 1) * this.pageSize; return this.filteredUsers.slice(s, s + this.pageSize); }
  get totalPages(): number { return Math.max(1, Math.ceil(this.filteredUsers.length / this.pageSize)); }
  get pageFrom(): number { return this.filteredUsers.length ? (this.page - 1) * this.pageSize + 1 : 0; }
  get pageTo(): number { return Math.min(this.page * this.pageSize, this.filteredUsers.length); }
}
