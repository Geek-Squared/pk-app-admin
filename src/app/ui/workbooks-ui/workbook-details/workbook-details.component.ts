import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-workbook-details',
  templateUrl: './workbook-details.component.html',
  styleUrls: ['./workbook-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkbookDetailsComponent implements OnInit {
  @Input() item;
  @Input() chapters = [];
  @Input() posts = [];
  @Output() closeModal = new EventEmitter();

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
