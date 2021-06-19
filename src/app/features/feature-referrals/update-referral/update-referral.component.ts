import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClrLoadingState } from '@clr/angular';
import { Referral } from 'src/app/models/referral.interface';
import { ReferralsService } from 'src/app/services';

@Component({
  selector: 'app-update-referral',
  templateUrl: './update-referral.component.html',
  styleUrls: ['./update-referral.component.scss'],
})
export class UpdateReferralComponent implements OnInit {
  @Output() closeModal = new EventEmitter();
  @Input() referral;
  public buttonState = ClrLoadingState.DEFAULT;

  constructor(private referralsService: ReferralsService) {}

  ngOnInit(): void {
    console.log(this.referral);
  }

  onSubmit(referral: Referral) {
    this.buttonState = ClrLoadingState.LOADING;
    referral.createdDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    this.referralsService.updateReferral(referral).then(
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
