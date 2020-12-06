import { Component, OnInit } from '@angular/core';
import { Chapter } from 'src/app/models/chapter.interface';
import { ChaptersService } from 'src/app/services/chapters.service';

@Component({
  selector: 'app-list-chapters',
  templateUrl: './list-chapters.component.html',
  styleUrls: ['./list-chapters.component.scss'],
})
export class ListChaptersComponent implements OnInit {
  public isCreate: boolean;
  public chapters: Chapter[];
  public isLoading: boolean;

  constructor(private chaptersService: ChaptersService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.chaptersService.getChapters().subscribe(
      (data) => {
        this.chapters = data.map((e: any) => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data(),
          } as Chapter;
        });
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}
