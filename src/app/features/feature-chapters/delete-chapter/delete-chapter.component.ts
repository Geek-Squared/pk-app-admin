import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClrLoadingState } from '@clr/angular';
import { ChaptersService } from 'src/app/services/chapters.service';

@Component({
  selector: 'app-delete-chapter',
  templateUrl: './delete-chapter.component.html',
  styleUrls: ['./delete-chapter.component.scss'],
})
export class DeleteChapterComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  @Input() chapterId: string;
  public buttonState = ClrLoadingState.DEFAULT;

  constructor(private chaptersService: ChaptersService) {}

  ngOnInit(): void {}

  onSubmit() {
    this.buttonState = ClrLoadingState.LOADING;
    this.chaptersService.deleteChapter(this.chapterId).then(
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
