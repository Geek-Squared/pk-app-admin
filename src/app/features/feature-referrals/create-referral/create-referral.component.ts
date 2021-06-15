import { formatDate } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ClrLoadingState } from '@clr/angular';
import { Referral } from 'src/app/models/referral.interface';
import { ReferralsService } from 'src/app/services';

@Component({
  selector: 'app-create-referral',
  templateUrl: './create-referral.component.html',
  styleUrls: ['./create-referral.component.scss'],
})
export class CreateReferralComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  public buttonState = ClrLoadingState.DEFAULT;

  constructor(private referralsService: ReferralsService) {}

  ngOnInit(): void {}

  onSubmit(referral: Referral) {
    this.buttonState = ClrLoadingState.LOADING;
    referral.createdDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    this.referralsService.createReferral(referral).then(
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
