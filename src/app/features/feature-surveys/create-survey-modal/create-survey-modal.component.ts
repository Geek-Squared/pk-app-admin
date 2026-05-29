import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ClrLoadingState } from '@clr/angular';
import { SurveysService } from 'src/app/services';

type QType = 'text' | 'comment' | 'rating' | 'radiogroup' | 'checkbox' | 'boolean';

interface BuilderQuestion {
  type: QType;
  title: string;
  options: string[];
}

const TYPE_OPTIONS: { value: QType; label: string; hasOptions: boolean; }[] = [
  { value: 'text',       label: 'Short answer',     hasOptions: false },
  { value: 'comment',    label: 'Long answer',      hasOptions: false },
  { value: 'rating',     label: 'Rating (1–5)',     hasOptions: false },
  { value: 'radiogroup', label: 'Single choice',    hasOptions: true  },
  { value: 'checkbox',   label: 'Multiple choice',  hasOptions: true  },
  { value: 'boolean',    label: 'Yes / No',         hasOptions: false },
];

@Component({
  selector: 'app-create-survey-modal',
  templateUrl: './create-survey-modal.component.html',
  styleUrls: ['./create-survey-modal.component.scss'],
})
export class CreateSurveyModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter();

  readonly typeOptions = TYPE_OPTIONS;

  public name = '';
  public description = '';
  public active = true;
  public questions: BuilderQuestion[] = [
    { type: 'text', title: '', options: [] },
  ];
  public btnState = ClrLoadingState.DEFAULT;

  constructor(private surveysService: SurveysService) {}
  ngOnInit(): void {}

  hasOptions(type: QType): boolean {
    return type === 'radiogroup' || type === 'checkbox';
  }

  typeLabel(type: QType): string {
    return TYPE_OPTIONS.find(t => t.value === type)?.label || type;
  }

  addQuestion() {
    this.questions.push({ type: 'text', title: '', options: [] });
  }

  removeQuestion(i: number) {
    this.questions.splice(i, 1);
  }

  changeType(q: BuilderQuestion, type: QType) {
    q.type = type;
    if (this.hasOptions(type) && !q.options.length) {
      q.options = ['', ''];
    } else if (!this.hasOptions(type)) {
      q.options = [];
    }
  }

  addOption(q: BuilderQuestion) {
    q.options.push('');
  }

  removeOption(q: BuilderQuestion, idx: number) {
    q.options.splice(idx, 1);
  }

  trackByIndex(i: number) { return i; }

  get canSubmit(): boolean {
    if (!this.name.trim()) return false;
    if (!this.questions.length) return false;
    return this.questions.every(q => {
      if (!q.title.trim()) return false;
      if (this.hasOptions(q.type)) {
        const filled = q.options.filter(o => o.trim()).length;
        if (filled < 2) return false;
      }
      return true;
    });
  }

  private buildSchema() {
    const elements = this.questions.map((q, i) => {
      const el: any = {
        type: q.type,
        name: `q${i + 1}`,
        title: q.title.trim(),
      };
      if (q.type === 'rating') el.rateMax = 5;
      if (this.hasOptions(q.type)) el.choices = q.options.map(o => o.trim()).filter(Boolean);
      return el;
    });
    return { title: this.name.trim(), elements };
  }

  onSubmit() {
    if (!this.canSubmit) return;
    this.btnState = ClrLoadingState.LOADING;
    this.surveysService
      .createSurvey({
        name: this.name.trim(),
        description: this.description.trim(),
        schema: this.buildSchema(),
        active: this.active,
      })
      .then(() => {
        this.btnState = ClrLoadingState.SUCCESS;
        this.closeModal.emit();
      })
      .catch(() => { this.btnState = ClrLoadingState.ERROR; });
  }
}
