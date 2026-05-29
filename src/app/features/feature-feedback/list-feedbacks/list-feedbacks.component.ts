import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-list-feedbacks',
  templateUrl: './list-feedbacks.component.html',
  styleUrls: ['./list-feedbacks.component.scss'],
})
export class ListFeedbacksComponent implements OnInit, AfterViewChecked {
  public feedback: any[] = [];
  public filteredFeedback: any[] = [];
  public isLoading = false;
  public searchTerm = '';
  public page = 1;
  public readonly pageSize = 10;

  constructor(private feedbackService: FeedbackService, private cdr: ChangeDetectorRef) {}
  ngAfterViewChecked() { this.cdr.detectChanges(); }

  ngOnInit(): void {
    this.isLoading = true;
    this.feedbackService.getFeedback().subscribe(
      (data) => {
        this.feedback = data.map((e: any) => ({ id: e.payload.doc.id, ...e.payload.doc.data() }));
        this.applyFilter();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      () => { this.isLoading = false; }
    );
  }

  onSearchTermChange(value: string) { this.searchTerm = value; this.page = 1; this.applyFilter(); }

  private applyFilter() {
    const term = (this.searchTerm || '').trim().toLowerCase();
    this.filteredFeedback = term
      ? this.feedback.filter(f =>
          (f.name || '').toLowerCase().includes(term) ||
          (f.message || '').toLowerCase().includes(term) ||
          (f.phoneNumber || '').toLowerCase().includes(term))
      : [...this.feedback];
  }

  get pagedFeedback(): any[] { const s = (this.page - 1) * this.pageSize; return this.filteredFeedback.slice(s, s + this.pageSize); }
  get totalPages(): number { return Math.max(1, Math.ceil(this.filteredFeedback.length / this.pageSize)); }
  get pageFrom(): number { return this.filteredFeedback.length ? (this.page - 1) * this.pageSize + 1 : 0; }
  get pageTo(): number { return Math.min(this.page * this.pageSize, this.filteredFeedback.length); }
}
