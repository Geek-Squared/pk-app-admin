import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClrLoadingState } from '@clr/angular';
import { QuestionsService } from 'src/app/services/questions.service';

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.scss'],
})
export class CreateQuestionComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  @Input() postId: string;
  public buttonState = ClrLoadingState.DEFAULT;

  constructor(private questionsService: QuestionsService) {}

  ngOnInit(): void {}

  onSubmit(question) {
    this.buttonState = ClrLoadingState.LOADING;
    question.createdDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    question.postId = this.postId;
    this.questionsService.createQuestion(question).then(
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
