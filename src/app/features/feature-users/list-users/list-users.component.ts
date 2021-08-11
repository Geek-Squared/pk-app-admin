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
  public users: any[];
  public isLoading: boolean;

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
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}
