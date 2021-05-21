import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ClrLoadingState } from '@clr/angular';
import { Chapter } from 'src/app/models/chapter.interface';

@Component({
  selector: 'app-chapter-form',
  templateUrl: './chapter-form.component.html',
  styleUrls: ['./chapter-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChapterFormComponent implements OnInit {
  @Input() chapter: Chapter;
  @Input() btnState: ClrLoadingState;
  @Input() title: string;
  @Output() formValue = new EventEmitter();
  @Output() closeModal = new EventEmitter();
  public opened = true;
  public chapterForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
    if (this.chapter) {
      this.chapterForm.addControl('id', new FormControl(''));
      this.chapterForm.patchValue(this.chapter);
    }
  }

  private createForm() {
    this.chapterForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required]],
      order: [''],
      uid: '',
    });
  }
}
