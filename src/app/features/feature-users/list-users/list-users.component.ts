import { AfterViewChecked, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { ClrLoadingState } from '@clr/angular';
import { UsersService } from 'src/app/services';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
})
export class ListUsersComponent implements OnInit, AfterViewChecked {
  public isCreate = false;
  public isEdit = false;
  public isArchive = false;
  public isDelete = false;
  public users: any[] = [];
  public filteredUsers: any[] = [];
  public isLoading = false;
  public searchTerm = '';
  public page = 1;
  public readonly pageSize = 10;
  public openMenuId: string | null = null;
  public menuTop = 0;
  public menuRight = 0;
  public selectedUser: any = null;
  public buttonState = ClrLoadingState.DEFAULT;

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

  @HostListener('document:click')
  closeMenus() { this.openMenuId = null; }

  toggleMenu(event: Event, user: any) {
    event.stopPropagation();
    if (this.openMenuId === user.id) {
      this.openMenuId = null;
      return;
    }
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const menuHeight = 156;
    const spaceBelow = window.innerHeight - rect.bottom;
    this.menuRight = window.innerWidth - rect.right;
    this.menuTop = spaceBelow < menuHeight + 8 ? rect.top - menuHeight - 4 : rect.bottom + 4;
    this.openMenuId = user.id;
  }

  editUser(event: Event, user: any) {
    event.stopPropagation();
    this.selectedUser = user;
    this.openMenuId = null;
    this.buttonState = ClrLoadingState.DEFAULT;
    this.isEdit = true;
  }

  archiveUser(event: Event, user: any) {
    event.stopPropagation();
    this.selectedUser = user;
    this.openMenuId = null;
    this.buttonState = ClrLoadingState.DEFAULT;
    this.isArchive = true;
  }

  deleteUser(event: Event, user: any) {
    event.stopPropagation();
    this.selectedUser = user;
    this.openMenuId = null;
    this.buttonState = ClrLoadingState.DEFAULT;
    this.isDelete = true;
  }

  onEditSubmit(value: any) {
    this.buttonState = ClrLoadingState.LOADING;
    const { id, postId, ...data } = value;
    this.usersService.updateUser(this.selectedUser.id, data).then(
      () => { this.buttonState = ClrLoadingState.SUCCESS; this.isEdit = false; },
      () => { this.buttonState = ClrLoadingState.ERROR; }
    );
  }

  onArchiveConfirm() {
    this.buttonState = ClrLoadingState.LOADING;
    this.usersService.archiveUser(this.selectedUser.id, !this.selectedUser.archived).then(
      () => { this.buttonState = ClrLoadingState.SUCCESS; this.isArchive = false; },
      () => { this.buttonState = ClrLoadingState.ERROR; }
    );
  }

  onDeleteConfirm() {
    this.buttonState = ClrLoadingState.LOADING;
    this.usersService.deleteUser(this.selectedUser.id).then(
      () => { this.buttonState = ClrLoadingState.SUCCESS; this.isDelete = false; },
      () => { this.buttonState = ClrLoadingState.ERROR; }
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
