import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClrLoadingState } from '@clr/angular';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionFormComponent implements OnInit {
  @Input() title: string;
  @Input() question;
  @Input() btnState: ClrLoadingState;
  @Output() formValue = new EventEmitter();
  @Output() closeModal = new EventEmitter();
  public questionForm: FormGroup;
  public opened = true;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
    if (this.question) {
      this.questionForm.patchValue(this.question);
    }
  }

  private createForm() {
    this.questionForm = this.fb.group({
      narrative: '',
      order: '',
      questionId: '',
    });
  }
}
