import { Component, Input, OnInit } from '@angular/core';
import { QuestionsService } from 'src/app/services/questions.service';

@Component({
  selector: 'app-list-questions',
  templateUrl: './list-questions.component.html',
  styleUrls: ['./list-questions.component.scss'],
})
export class ListQuestionsComponent implements OnInit {
  @Input() postId: string;
  @Input() chapterId: string;
  public isCreate: boolean;
  public isUpdate: boolean;
  public isDelete: boolean;
  public questions: any[];
  public isLoading: boolean;
  public selectedQuestion: any;

  constructor(private questionsService: QuestionsService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.questionsService.getQuestionsByPostId(this.postId).subscribe(
      (data) => {
        this.questions = data.map((e: any) => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data(),
          };
        });
        this.questions = this.questions.sort((a, b) => (a.createdDate > b.createdDate ? 1 : -1));
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  public updateQuestion(question) {
    this.selectedQuestion = question;
    this.isUpdate = true;
  }

  public deleteQuestion(question) {
    this.selectedQuestion = question;
    this.isDelete = true;
  }
}
