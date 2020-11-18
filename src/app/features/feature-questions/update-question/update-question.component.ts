import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClrLoadingState } from '@clr/angular';
import { AuthenticationService, FilesService } from 'src/app/services';
import { QuestionsService } from 'src/app/services/questions.service';

@Component({
  selector: 'app-update-question',
  templateUrl: './update-question.component.html',
  styleUrls: ['./update-question.component.scss'],
})
export class UpdateQuestionComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  @Input() question;
  public buttonState = ClrLoadingState.DEFAULT;

  constructor(private questionsService: QuestionsService) {}

  ngOnInit(): void {}

  onSubmit(question) {
    this.buttonState = ClrLoadingState.LOADING;
    this.questionsService.updateQuestion(question).then(
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
