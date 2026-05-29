import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
})
export class ListUsersComponent implements OnInit, AfterViewChecked {
  public isCreate = false;
  public users: any[] = [];
  public filteredUsers: any[] = [];
  public isLoading = false;
  public searchTerm = '';
  public page = 1;
  public readonly pageSize = 10;

  constructor(private usersService: UsersService, private cdr: ChangeDetectorRef) {}

  ngAfterViewChecked() { this.cdr.detectChanges(); }

  ngOnInit(): void {
    this.isLoading = true;
    this.usersService.getUsers().subscribe(
      (data) => {
        this.users = data.map((e: any) => ({ postId: e.payload.doc.id, id: e.payload.doc.id, ...e.payload.doc.data() }));
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
          (u.email || '').toLowerCase().includes(term) ||
          (u.displayName || '').toLowerCase().includes(term) ||
          (u.role || '').toLowerCase().includes(term))
      : [...this.users];
  }

  get pagedUsers(): any[] {
    const s = (this.page - 1) * this.pageSize;
    return this.filteredUsers.slice(s, s + this.pageSize);
  }
  get totalPages(): number { return Math.max(1, Math.ceil(this.filteredUsers.length / this.pageSize)); }
  get pageFrom(): number { return this.filteredUsers.length ? (this.page - 1) * this.pageSize + 1 : 0; }
  get pageTo(): number { return Math.min(this.page * this.pageSize, this.filteredUsers.length); }
}
