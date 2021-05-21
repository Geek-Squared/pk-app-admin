import { Component, Input, OnInit } from '@angular/core';
import { Chapter } from 'src/app/models/chapter.interface';
import { ChaptersService } from 'src/app/services/chapters.service';

@Component({
  selector: 'app-list-chapters',
  templateUrl: './list-chapters.component.html',
  styleUrls: ['./list-chapters.component.scss'],
})
export class ListChaptersComponent implements OnInit {
  @Input() interventionId: string;
  public isCreate: boolean;
  public chapters: Chapter[];
  public isLoading: boolean;

  constructor(private chaptersService: ChaptersService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.chaptersService
      .getChaptersByInterventionId(this.interventionId)
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
