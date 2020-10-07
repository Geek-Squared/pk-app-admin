import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionConfirmationFormComponent } from './action-confirmation-form/action-confirmation-form.component';
import { ClarityModule } from '@clr/angular';

@NgModule({
  declarations: [ActionConfirmationFormComponent],
  imports: [CommonModule, ClarityModule],
  exports: [ActionConfirmationFormComponent],
})
export class SharedUiModule {}
