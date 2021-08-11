import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserFormComponent } from './user-form/user-form.component';
import { ClarityModule } from '@clr/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UserFormComponent],
  imports: [CommonModule, ClarityModule, ReactiveFormsModule, FormsModule],
  exports: [UserFormComponent],
})
export class UsersUiModule {}
