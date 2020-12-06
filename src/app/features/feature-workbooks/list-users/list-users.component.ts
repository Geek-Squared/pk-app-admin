import { Component, OnInit } from '@angular/core';
import { Chapter } from 'src/app/models/chapter.interface';
import { UPost } from 'src/app/models/post.interface';
import { UsersService } from 'src/app/services';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
})
export class ListUsersComponent implements OnInit {
  public users: any[];
  public isLoading: boolean;
  public chapters: Chapter[];
  public posts: UPost[];

  constructor(private usersService: UsersService) {}

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
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}
