import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Chapter } from 'src/app/models/chapter.interface';
import { ChaptersService } from 'src/app/services/chapters.service';

@Component({
  selector: 'app-list-chapters',
  templateUrl: './list-chapters.component.html',
  styleUrls: ['./list-chapters.component.scss'],
})
export class ListChaptersComponent implements OnInit {
  @Input() categoryId: string;
  @Input() interventionId: string;
  public isCreate: boolean;
  public isUpdate = false;
  public isDelete = false;
  public chapters: Chapter[];
  public isLoading: boolean;
  public openMenuId: string | null = null;
  public selectedChapter: Chapter | null = null;

  constructor(private chaptersService: ChaptersService) {}

  @HostListener('document:click')
  closeMenus() {
    this.openMenuId = null;
  }

  toggleMenu(event: Event, chapter: Chapter) {
    event.stopPropagation();
    event.preventDefault();
    this.openMenuId = this.openMenuId === chapter.id ? null : chapter.id;
  }

  editChapter(event: Event, chapter: Chapter) {
    event.stopPropagation();
    event.preventDefault();
    this.selectedChapter = chapter;
    this.openMenuId = null;
    this.isUpdate = true;
  }

  deleteChapter(event: Event, chapter: Chapter) {
    event.stopPropagation();
    event.preventDefault();
    this.selectedChapter = chapter;
    this.openMenuId = null;
    this.isDelete = true;
  }

  ngOnInit(): void {
    this.isLoading = true;
    // When opened directly under an intervention (no category), list chapters
    // by interventionId; otherwise scope to the category.
    const source$ = this.categoryId
      ? this.chaptersService.getChaptersByCategoryIdAndInterventionId(
          this.categoryId,
          this.interventionId
        )
      : this.chaptersService.getChaptersByInterventionId(this.interventionId);
    source$
      .subscribe(
        (data) => {
          this.chapters = data
            .map((e: any) => {
              return {
                id: e.payload.doc.id,
                ...e.payload.doc.data(),
              } as Chapter;
            })
            .sort((a, b) =>
              a.order > b.order ? 1 : b.order > a.order ? -1 : 0
            );

          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        }
      );
  }
}
