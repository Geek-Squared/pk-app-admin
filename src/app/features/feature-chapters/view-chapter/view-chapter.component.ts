import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chapter } from 'src/app/models/chapter.interface';
import { ChaptersService } from 'src/app/services/chapters.service';

@Component({
  selector: 'app-view-chapter',
  templateUrl: './view-chapter.component.html',
  styleUrls: ['./view-chapter.component.scss'],
})
export class ViewChapterComponent implements OnInit {
  public chapter$ = this.chaptersService.getChapterById(
    this.route.snapshot.paramMap.get('chapterId')
  );
  public isUpdate: boolean;
  public selectedChapter: Chapter;

  constructor(
    public route: ActivatedRoute,
    private chaptersService: ChaptersService
  ) {}

  ngOnInit(): void {}

  updateChapter(chapter) {
    this.selectedChapter = chapter;
    this.isUpdate = true;
  }
}
