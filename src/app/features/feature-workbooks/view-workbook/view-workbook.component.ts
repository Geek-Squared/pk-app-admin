import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chapter } from 'src/app/models/chapter.interface';
import { UPost } from 'src/app/models/post.interface';
import { PostsService, WorkbooksService } from 'src/app/services';
import { ChaptersService } from 'src/app/services/chapters.service';

@Component({
  selector: 'app-view-workbook',
  templateUrl: './view-workbook.component.html',
  styleUrls: ['./view-workbook.component.scss'],
})
export class ViewWorkbookComponent implements OnInit {
  public chapters: Chapter[] = [];
  public workbook;
  public posts: UPost[] = [];

  constructor(
    private workbooksService: WorkbooksService,
    private route: ActivatedRoute,
    private postsService: PostsService,
    private chaptersService: ChaptersService
  ) {}

  ngOnInit(): void {
    this.getAllChapters();
    this.getPosts();
    this.workbooksService
      .getWorkBook(this.route.snapshot.paramMap.get('userUid'))
      .subscribe((res: any) => (this.workbook = res[0]?.responses));
  }

  private getPosts() {
    this.postsService.getPosts().subscribe((data) => {
      this.posts = data.map((e: any) => {
        return {
          postId: e.payload.doc.id,
          id: e.payload.doc.id,
          ...e.payload.doc.data(),
        };
      });
    });
  }

  private getAllChapters() {
    this.chaptersService.getChapters().subscribe(
      (data) => {
        this.chapters = data.map((e: any) => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data(),
          } as Chapter;
        });
      },
      () => {}
    );
  }

  public getDetails(postId: string) {
    const post = this.posts.find((post) => post?.id === postId);
    const chapter = this.chapters.find(
      (chapter) => chapter?.id === post?.chapterId
    );

    return { postTitle: post?.title, chapterTitle: chapter?.title };
  }
}
