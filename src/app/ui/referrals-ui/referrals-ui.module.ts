import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferralsFormComponent } from './referrals-form/referrals-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';


@NgModule({
  declarations: [ReferralsFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClarityModule,
    FormsModule
  ],
  exports: [ReferralsFormComponent]
})
export class ReferralsUiModule { }
