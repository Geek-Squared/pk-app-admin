import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClrLoadingState } from '@clr/angular';
import { Chapter } from 'src/app/models/chapter.interface';
import { AuthenticationService } from 'src/app/services';
import { ChaptersService } from 'src/app/services/chapters.service';

@Component({
  selector: 'app-create-chapter',
  templateUrl: './create-chapter.component.html',
  styleUrls: ['./create-chapter.component.scss'],
})
export class CreateChapterComponent implements OnInit {
  @Input() interventionId: string;
  @Output() closeModal = new EventEmitter();
  public buttonState = ClrLoadingState.DEFAULT;

  constructor(
    private chaptersService: ChaptersService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {}

  onSubmit(chapter: Chapter) {
    this.buttonState = ClrLoadingState.LOADING;
    chapter.uid = this.authService.user.uid;
    chapter.createdDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    chapter.interventionId = this.interventionId;
    this.chaptersService.createChapter(chapter).then(
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
