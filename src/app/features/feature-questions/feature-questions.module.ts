import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateQuestionComponent } from './create-question/create-question.component';
import { DeleteQuestionComponent } from './delete-question/delete-question.component';
import { UpdateQuestionComponent } from './update-question/update-question.component';
import { ListQuestionsComponent } from './list-questions/list-questions.component';
import { ClarityModule } from '@clr/angular';
import { PostsUiModule, SharedUiModule } from 'src/app/ui';

@NgModule({
  declarations: [
    CreateQuestionComponent,
    DeleteQuestionComponent,
    UpdateQuestionComponent,
    ListQuestionsComponent,
  ],
  exports: [
    CreateQuestionComponent,
    DeleteQuestionComponent,
    UpdateQuestionComponent,
    ListQuestionsComponent,
  ],
  imports: [CommonModule, ClarityModule, PostsUiModule, SharedUiModule],
})
export class FeatureQuestionsModule {}
