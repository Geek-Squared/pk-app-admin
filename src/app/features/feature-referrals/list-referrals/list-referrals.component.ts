import { Component, OnInit } from '@angular/core';
import { ReferralsService } from 'src/app/services';
import { Utilities } from 'src/app/models/utils';

@Component({
  selector: 'app-list-referrals',
  templateUrl: './list-referrals.component.html',
  styleUrls: ['./list-referrals.component.scss'],
})
export class ListReferralsComponent implements OnInit {
  public referral: any[] = [];
  public filteredReferrals: any[] = [];
  public isLoading = false;
  public isCreate = false;
  public isUpdate = false;
  public selectedReferral: any;
  public searchTerm = '';
  public page = 1;
  public readonly pageSize = 10;

  constructor(private referralService: ReferralsService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.referralService.getReferrals().subscribe(
      (data) => {
        this.referral = data
          .map((e: any) => ({ id: e.payload.doc.id, ...e.payload.doc.data() }))
          .sort(Utilities.byOrder);
        this.applyFilter();
        this.isLoading = false;
      },
      () => { this.isLoading = false; }
    );
  }

  onSearchTermChange(value: string) { this.searchTerm = value; this.page = 1; this.applyFilter(); }

  private applyFilter() {
    const term = (this.searchTerm || '').trim().toLowerCase();
    this.filteredReferrals = term
      ? this.referral.filter(r =>
          (r.name || '').toLowerCase().includes(term) ||
          (r.phoneNumber || '').toLowerCase().includes(term) ||
          (r.address || '').toLowerCase().includes(term))
      : [...this.referral];
  }

  updateReferral(ref: any) { this.selectedReferral = ref; this.isUpdate = true; }

  get pagedReferrals(): any[] { const s = (this.page - 1) * this.pageSize; return this.filteredReferrals.slice(s, s + this.pageSize); }
  get totalPages(): number { return Math.max(1, Math.ceil(this.filteredReferrals.length / this.pageSize)); }
  get pageFrom(): number { return this.filteredReferrals.length ? (this.page - 1) * this.pageSize + 1 : 0; }
  get pageTo(): number { return Math.min(this.page * this.pageSize, this.filteredReferrals.length); }
}
