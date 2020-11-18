import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClrLoadingState } from '@clr/angular';
import { Chapter } from 'src/app/models/chapter.interface';
import { AuthenticationService } from 'src/app/services';
import { ChaptersService } from 'src/app/services/chapters.service';

@Component({
  selector: 'app-update-chapter',
  templateUrl: './update-chapter.component.html',
  styleUrls: ['./update-chapter.component.scss'],
})
export class UpdateChapterComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  @Input() chapter: Chapter;
  public buttonState = ClrLoadingState.DEFAULT;

  constructor(private chaptersService: ChaptersService) {}

  ngOnInit(): void {}

  onSubmit(chapter: Chapter) {
    this.buttonState = ClrLoadingState.LOADING;
    this.chaptersService.updateChapter(chapter).then(
      () => {
        this.closeModal.emit();
        this.buttonState = ClrLoadingState.SUCCESS;
      },
      () => {
        this.buttonState = ClrLoadingState.ERROR;
      }
    );
  }
}
