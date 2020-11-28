import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
      this.questionForm.addControl('id', new FormControl(''));
      this.questionForm.patchValue(this.question);
    }
  }

  private createForm() {
    this.questionForm = this.fb.group({
      narrative: ['', Validators.required],
      order: ['', Validators.required],
    });
  }
}
