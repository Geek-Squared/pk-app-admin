import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClrLoadingState } from '@clr/angular';
import { Survey } from 'src/app/models/survey.interface';
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
  selector: 'app-survey-editor-modal',
  templateUrl: './survey-editor-modal.component.html',
  styleUrls: ['./survey-editor-modal.component.scss'],
})
export class SurveyEditorModalComponent implements OnInit {
  /** Pass an existing survey to edit it; omit to create a new one. */
  @Input() survey: Survey | null = null;
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

  ngOnInit(): void {
    if (this.survey) {
      this.name = this.survey.name || '';
      this.description = this.survey.description || '';
      this.active = !!this.survey.active;
      const existing = this.toBuilderQuestions(this.survey);
      if (existing.length) {
        this.questions = existing;
      }
    }
  }

  get isEdit(): boolean {
    return !!this.survey?.id;
  }

  get heading(): string {
    return this.isEdit ? 'Edit survey' : 'Create survey';
  }

  /** Rebuilds the visual builder's state from a stored SurveyJS schema. */
  private toBuilderQuestions(survey: Survey): BuilderQuestion[] {
    const schema: any = survey?.schema;
    const elements: any[] =
      schema?.elements ||
      schema?.pages?.reduce((acc: any[], p: any) => acc.concat(p.elements || []), []) ||
      [];

    return elements.map((el: any) => {
      const type: QType = TYPE_OPTIONS.some((t) => t.value === el?.type) ? el.type : 'text';
      const options = Array.isArray(el?.choices)
        ? el.choices.map((c: any) => (typeof c === 'string' ? c : c?.text ?? c?.value ?? ''))
        : [];
      return {
        type,
        title: el?.title || el?.name || '',
        options: this.hasOptions(type) && options.length < 2 ? ['', ''] : options,
      };
    });
  }

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

    const payload = {
      name: this.name.trim(),
      description: this.description.trim(),
      schema: this.buildSchema(),
      active: this.active,
    };

    const save = this.isEdit
      ? this.surveysService.updateSurvey(this.survey.id, payload)
      : this.surveysService.createSurvey(payload);

    save
      .then(() => {
        this.btnState = ClrLoadingState.SUCCESS;
        this.closeModal.emit();
      })
      .catch(() => { this.btnState = ClrLoadingState.ERROR; });
  }
}
