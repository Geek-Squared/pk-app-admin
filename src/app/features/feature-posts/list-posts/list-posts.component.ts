import { Component, Input, OnInit } from '@angular/core';
import { UPost } from 'src/app/models/post.interface';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-list-posts',
  templateUrl: './list-posts.component.html',
  styleUrls: ['./list-posts.component.scss'],
})
export class ListPostsComponent implements OnInit {
  @Input() chapterId: string;
  public isCreate: boolean;
  public isUpdate: boolean;
  public isDelete: boolean;
  public posts: UPost[];
  public isLoading: boolean;
  public selectedPost: UPost;

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPostsByChapterId(this.chapterId).subscribe(
      (data) => {
        this.posts = data.map((e: any) => {
          return {
            postId: e.payload.doc.id,
            id: e.payload.doc.id,
            ...e.payload.doc.data(),
          };
        });
        this.posts = this.posts.sort((a, b) => (a.order > b.order ? 1 : -1));

        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  public updatePost(post: UPost) {
    this.selectedPost = post;
    this.isUpdate = true;
  }

  public deletePost(post: UPost) {
    this.selectedPost = post;
    this.isDelete = true;
  }
}
