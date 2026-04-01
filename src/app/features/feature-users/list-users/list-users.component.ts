import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { UsersService } from 'src/app/services';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
})
export class ListUsersComponent implements OnInit, AfterViewChecked {
  public isCreate: boolean;
  public isEdit: boolean;
  public selectedUser: any;
  public users: any[];
  public filteredUsers: any[];
  public isLoading: boolean;
  public searchTerm = '';

  constructor(
    private usersService: UsersService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.usersService.getUsers().subscribe(
      (data) => {
        this.users = data.map((e: any) => {
          return {
            postId: e.payload.doc.id,
            id: e.payload.doc.id,
            ...e.payload.doc.data(),
          };
        });
        console.log('Fetched Users:', this.users);
        this.applyFilter();
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onSearchTermChange(value: string) {
    this.searchTerm = value;
    this.applyFilter();
  }

  private applyFilter() {
    const term = (this.searchTerm || '').trim().toLowerCase();
    if (!term) {
      this.filteredUsers = this.users || [];
      return;
    }

    this.filteredUsers = (this.users || []).filter((user) => {
      const email = (user?.email || '').toString().toLowerCase();
      const displayName = (user?.displayName || '').toString().toLowerCase();
      const role = (user?.role || '').toString().toLowerCase();
      return (
        email.includes(term) ||
        displayName.includes(term) ||
        role.includes(term)
      );
    });
  }

  onEdit(user: any) {
    this.selectedUser = user;
    this.isEdit = true;
  }
}
