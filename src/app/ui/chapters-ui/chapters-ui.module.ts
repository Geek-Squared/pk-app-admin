import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChapterFormComponent } from './chapter-form/chapter-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

@NgModule({
  declarations: [ChapterFormComponent],
  imports: [CommonModule, ClarityModule, ReactiveFormsModule, FormsModule],
  exports: [ChapterFormComponent],
})
export class ChaptersUiModule {}
