import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Chapter } from 'src/app/models/chapter.interface';
import { UPost } from 'src/app/models/post.interface';
import { UsersService } from 'src/app/services';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
})
export class ListUsersComponent implements OnInit, AfterViewChecked {
  public users: any[];
  public filteredUsers: any[];
  public isLoading: boolean;
  public searchTerm = '';
  public isViewWorkbookOpen = false;
  public selectedUserUid: string | null = null;

  constructor(
    private usersService: UsersService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.usersService.getUsers().subscribe(
      (data) => {
        this.users = data.map((e: any) => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data(),
          } as any;
        });
        this.applySearch();
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  public applySearch() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredUsers = this.users;
      return;
    }

    this.filteredUsers = (this.users || []).filter((user) => {
      const email = (user?.email || '').toLowerCase();
      const name = (user?.displayName || '').toLowerCase();
      const uid = (user?.uid || user?.id || '').toLowerCase();
      return (
        email.includes(term) || name.includes(term) || uid.includes(term)
      );
    });
  }

  public openWorkbook(uid: string) {
    this.selectedUserUid = uid;
    this.isViewWorkbookOpen = true;
  }

  public closeWorkbook() {
    this.isViewWorkbookOpen = false;
    this.selectedUserUid = null;
  }
}
