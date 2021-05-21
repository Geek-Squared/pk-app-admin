import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterventionFormComponent } from './intervention-form/intervention-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

@NgModule({
  declarations: [InterventionFormComponent],
  imports: [CommonModule, ClarityModule, ReactiveFormsModule, FormsModule],
  exports: [InterventionFormComponent],
})
export class InterventionsUiModule {}
