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
import { combineLatest } from 'rxjs';
import { Chapter } from 'src/app/models/chapter.interface';
import { UPost } from 'src/app/models/post.interface';
import {
  PostsService,
  WorkbooksService,
  UsersService,
} from 'src/app/services';
import { ChaptersService } from 'src/app/services/chapters.service';
import { ChatsService } from 'src/app/services/chats.service';

interface ReflectionItem {
  question: string;
  answer: string;
  postTitle?: string;
}

interface ReflectionGroup {
  chapterTitle: string;
  order: number;
  items: ReflectionItem[];
}

@Component({
  selector: 'app-view-workbook',
  templateUrl: './view-workbook.component.html',
  styleUrls: ['./view-workbook.component.scss'],
})
export class ViewWorkbookComponent implements OnInit, AfterViewChecked {
  public user: any = null;
  public isLoading = false;
  public isOpeningChat = false;

  public reflectionGroups: ReflectionGroup[] = [];
  public reflectionsWritten = 0;
  public chaptersCompleted = 0;
  public totalChapters = 0;
  public curriculumProgress = 0;

  constructor(
    private workbooksService: WorkbooksService,
    private route: ActivatedRoute,
    private postsService: PostsService,
    private chaptersService: ChaptersService,
    private usersService: UsersService,
    public chatsService: ChatsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const userUid = this.route.snapshot.paramMap.get('userUid');
    this.isLoading = true;

    combineLatest([
      this.usersService.getUserById(userUid),
      this.workbooksService.getWorkBook(userUid),
      this.postsService.getPosts(),
      this.chaptersService.getChapters(),
    ]).subscribe(
      ([user, workbooks, postsSnap, chaptersSnap]: any[]) => {
        this.user = user ? { uid: userUid, ...user } : { uid: userUid };

        const posts: UPost[] = postsSnap.map((e: any) => ({
          id: e.payload.doc.id,
          postId: e.payload.doc.id,
          ...e.payload.doc.data(),
        }));
        const chapters: Chapter[] = chaptersSnap.map((e: any) => ({
          id: e.payload.doc.id,
          ...e.payload.doc.data(),
        }));

        const workbook = workbooks?.[0];
        this.buildReflections(workbook, posts, chapters);
        this.computeStats(workbook, chapters);

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

  public async messageClient() {
    if (!this.user || this.isOpeningChat) {
      return;
    }
    this.isOpeningChat = true;
    try {
      await this.chatsService.openChatWithUser(this.user);
    } finally {
      this.isOpeningChat = false;
    }
  }

  public get initials(): string {
    const name = this.user?.displayName || this.user?.email || '';
    return name
      ? name
          .split(' ')
          .map((w: string) => w[0])
          .slice(0, 2)
          .join('')
          .toUpperCase()
      : '?';
  }

  private buildReflections(workbook: any, posts: UPost[], chapters: Chapter[]) {
    const responses: any[] = workbook?.responses || [];
    const groupMap = new Map<string, ReflectionGroup>();
    let count = 0;

    responses.forEach((resp) => {
      const content = resp?.content || {};
      Object.keys(content).forEach((key) => {
        const entry = content[key];
        const answer = (entry?.response ?? '').toString().trim();
        if (!entry || !answer) {
          return;
        }
        const post = posts.find((p) => p?.id === entry.postId);
        const chapter = chapters.find((c) => c?.id === post?.chapterId);
        const chapterId = chapter?.id || `__${entry.postId || 'other'}`;
        const chapterTitle = chapter?.title || 'Other responses';

        if (!groupMap.has(chapterId)) {
          groupMap.set(chapterId, {
            chapterTitle,
            order: chapter?.order ?? 999,
            items: [],
          });
        }
        groupMap.get(chapterId)!.items.push({
          question: entry.questionNarrative,
          answer,
          postTitle: post?.title,
        });
        count++;
      });
      this.getUniquePosts();
    });

    this.reflectionGroups = [...groupMap.values()].sort(
      (a, b) => a.order - b.order
    );
    this.reflectionsWritten = count;
  }

  private computeStats(workbook: any, chapters: Chapter[]) {
    let completed = Object.keys(workbook?.completedChapters || {}).length;
    let total = workbook?.totalChapterCount || 0;

    if (!total) {
      total = chapters.length;
    }
    if (!completed) {
      completed = this.reflectionGroups.filter(
        (g) => !g.chapterTitle.startsWith('Other')
      ).length;
    }

    this.chaptersCompleted = completed;
    this.totalChapters = total;
    this.curriculumProgress = total
      ? Math.round((completed / total) * 100)
      : completed > 0
      ? 100
      : 0;
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
