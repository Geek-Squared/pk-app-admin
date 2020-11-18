import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClrLoadingState } from '@clr/angular';
import { QuestionsService } from 'src/app/services/questions.service';

@Component({
  selector: 'app-delete-question',
  templateUrl: './delete-question.component.html',
  styleUrls: ['./delete-question.component.scss'],
})
export class DeleteQuestionComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  @Input() questionId: string;
  public buttonState = ClrLoadingState.DEFAULT;

  constructor(private questionsService: QuestionsService) {}

  ngOnInit(): void {}

  onSubmit() {
    this.buttonState = ClrLoadingState.LOADING;
    this.questionsService.deleteQuestion(this.questionId).then(
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
