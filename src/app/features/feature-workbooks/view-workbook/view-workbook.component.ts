import { Location } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chapter } from 'src/app/models/chapter.interface';
import { UPost } from 'src/app/models/post.interface';
import { PostsService, WorkbooksService } from 'src/app/services';
import { ChaptersService } from 'src/app/services/chapters.service';
import { Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-view-workbook',
  templateUrl: './view-workbook.component.html',
  styleUrls: ['./view-workbook.component.scss'],
})
export class ViewWorkbookComponent
  implements OnInit, AfterViewChecked, OnChanges {
  public chapters: Chapter[] = [];
  public workbook;
  public posts: UPost[] = [];
  public isLoading: boolean;
  public selectedWorkBookItem;
  public uniquePosts = [];
  public isViewDetails: boolean;
  public currentPostId: string | null = null;
  @Input() userUid: string;
  @Input() isModal: boolean = false;
  @Output() close = new EventEmitter<void>();
  private notificationPostId: string | null = null;
  private notificationChapterId: string | null = null;

  constructor(
    private workbooksService: WorkbooksService,
    private route: ActivatedRoute,
    private postsService: PostsService,
    private chaptersService: ChaptersService,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.notificationPostId = params.get('postId');
      this.notificationChapterId = params.get('chapterId');
      this.selectFromNotification();
    });
    this.getAllChapters();
    this.getPosts();
    if (this.userUid) {
      this.fetchWorkbook(this.userUid);
    } else {
      this.getWorkBook();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.userUid && changes.userUid.currentValue) {
      this.fetchWorkbook(changes.userUid.currentValue);
    }
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  private getWorkBook() {
    const uid = this.route.snapshot.paramMap.get('userUid');
    if (uid) {
      this.fetchWorkbook(uid);
    }
  }

  private fetchWorkbook(uid: string) {
    this.isLoading = true;
    this.workbooksService.getWorkBook(uid).subscribe(
      (res: any) => {
        this.workbook = res[0]?.responses || [];
        if (Array.isArray(this.workbook)) {
          this.workbook.sort(
            (a, b) => (b?.createdAt || 0) - (a?.createdAt || 0)
          );
        }
        this.getUniquePosts();
        this.selectFromNotification();
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
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
      this.getUniquePosts();
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

  private getUniquePosts() {
    const postIds = this.posts.map((p) => p.id);
    this.uniquePosts = [...new Set(postIds)];
  }

  public getSelectedWorkBookItem(postId: string) {
    this.currentPostId = postId;
    this.selectedWorkBookItem = this.workbook.find(
      (item) => item?.content['0']?.postId == postId
    );
    this.isViewDetails = true;
  }

  private selectFromNotification() {
    if (!Array.isArray(this.workbook) || !this.workbook.length) {
      return;
    }

    if (this.notificationPostId) {
      const match = this.workbook.find(
        (item) => item?.postId === this.notificationPostId
      );
      if (match) {
        this.currentPostId = this.notificationPostId;
        this.selectedWorkBookItem = match;
        this.isViewDetails = true;
        return;
      }
      this.getSelectedWorkBookItem(this.notificationPostId);
      return;
    }

    if (this.notificationChapterId) {
      const matches = this.workbook.filter(
        (item) => item?.chapterId === this.notificationChapterId
      );
      if (!matches.length) {
        return;
      }
      matches.sort(
        (a, b) => (b?.createdAt || 0) - (a?.createdAt || 0)
      );
      this.selectedWorkBookItem = matches[0];
      this.isViewDetails = true;
    }
  }

  goBack(): void {
    this.location.back();
  }
}
