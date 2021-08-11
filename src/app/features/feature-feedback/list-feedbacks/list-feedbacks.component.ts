import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-list-feedbacks',
  templateUrl: './list-feedbacks.component.html',
  styleUrls: ['./list-feedbacks.component.scss'],
})
export class ListFeedbacksComponent implements OnInit, AfterViewChecked {
  public feedback: any[];
  public isLoading: boolean;

  constructor(
    private feedbackService: FeedbackService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.feedbackService.getFeedback().subscribe(
      (data) => {
        this.feedback = data.map((e: any) => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data(),
          } as any;
        });

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }
}
