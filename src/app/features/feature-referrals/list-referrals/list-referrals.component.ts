import { Component, OnInit } from '@angular/core';
import { ReferralsService } from 'src/app/services';

@Component({
  selector: 'app-list-referrals',
  templateUrl: './list-referrals.component.html',
  styleUrls: ['./list-referrals.component.scss'],
})
export class ListReferralsComponent implements OnInit {
  public referral: any[];
  public isLoading: boolean;
  public isCreate;
  public isUpdate;
  public selectedReferral;

  constructor(private referralService: ReferralsService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.referralService.getReferrals().subscribe(
      (data) => {
        this.referral = data.map((e: any) => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data(),
          } as any;
        });
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  updateReferral(ref) {
    this.selectedReferral = ref;
    this.isUpdate = true;
  }
}
