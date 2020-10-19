import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostFormComponent } from './post-form/post-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { QuestionFormComponent } from './question-form/question-form.component';

@NgModule({
  declarations: [PostFormComponent, QuestionFormComponent],
  imports: [CommonModule, ClarityModule, ReactiveFormsModule, FormsModule],
  exports: [PostFormComponent, QuestionFormComponent],
})
export class PostsUiModule {}
