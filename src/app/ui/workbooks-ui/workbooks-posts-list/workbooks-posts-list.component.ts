import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-workbooks-posts-list',
  templateUrl: './workbooks-posts-list.component.html',
  styleUrls: ['./workbooks-posts-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkbooksPostsListComponent implements OnInit {
  @Input() postIds: string[] = [];
  @Input() chapters = [];
  @Input() posts = [];
  @Output() viewSelected = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  public getDetails(postId: string) {
    const post = this.posts.find((post) => post?.id === postId);
    const chapter = this.chapters.find(
      (chapter) => chapter?.id === post?.chapterId
    );

    return { postTitle: post?.title, chapterTitle: chapter?.title };
  }
}
