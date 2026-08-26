import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Intervention } from 'src/app/models/intervention.interface';
import {
  InterventionSurveys,
  SURVEY_TIMEPOINTS,
  Survey,
  SurveyTimepoint,
  SurveyTimepointDefinition,
  normaliseInterventionSurveys,
} from 'src/app/models/survey.interface';
import { Utilities } from 'src/app/models/utils';
import { InterventionsService, SurveysService } from 'src/app/services';

interface TimepointRow extends SurveyTimepointDefinition {
  surveys: Survey[];
}

/**
 * Attaches surveys to an intervention's Before / Midline / Endline timepoints.
 *
 * Surveys are not created here and are not owned by the intervention — they are
 * instruments authored in the Surveys section and referenced by id, so the same
 * one can be attached to several timepoints. That reuse is the point: asking
 * the same questions before and after is what makes the answers comparable.
 */
@Component({
  selector: 'app-intervention-surveys',
  templateUrl: './intervention-surveys.component.html',
  styleUrls: ['./intervention-surveys.component.scss'],
})
export class InterventionSurveysComponent implements OnChanges, OnDestroy {
  @Input() intervention: Intervention;

  public rows: TimepointRow[] = [];
  public allSurveys: Survey[] = [];
  public isLoading = false;
  public isSaving = false;

  /** Timepoint whose picker is open, or null. */
  public pickerFor: SurveyTimepoint | null = null;
  public pickerSearch = '';

  private assigned: InterventionSurveys = {};
  private subscription: Subscription | null = null;

  constructor(
    private surveysService: SurveysService,
    private interventionsService: InterventionsService
  ) {}

  ngOnChanges(): void {
    this.assigned = normaliseInterventionSurveys(this.intervention?.surveys);

    if (!this.subscription) {
      this.isLoading = true;
      this.subscription = this.surveysService.getSurveys().subscribe(
        (data: any[]) => {
          this.allSurveys = data
            .map((e: any) => ({ id: e.payload.doc.id, ...e.payload.doc.data() } as Survey))
            .filter((s) => !!s?.name)
            .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
          this.buildRows();
          this.isLoading = false;
        },
        () => { this.isLoading = false; }
      );
    }

    this.buildRows();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private buildRows(): void {
    this.rows = SURVEY_TIMEPOINTS.map((definition) => ({
      ...definition,
      surveys: (this.assigned[definition.key] || [])
        .map((id) => this.allSurveys.find((s) => s.id === id))
        .filter((s): s is Survey => !!s),
    }));
  }

  /** Ids attached at a timepoint, including any whose survey has been deleted. */
  private idsAt(timepoint: SurveyTimepoint): string[] {
    return this.assigned[timepoint] || [];
  }

  get totalAssigned(): number {
    return SURVEY_TIMEPOINTS.reduce((n, t) => n + this.idsAt(t.key).length, 0);
  }

  isAttached(timepoint: SurveyTimepoint, surveyId: string): boolean {
    return this.idsAt(timepoint).includes(surveyId);
  }

  openPicker(timepoint: SurveyTimepoint): void {
    this.pickerFor = timepoint;
    this.pickerSearch = '';
  }

  closePicker(): void {
    this.pickerFor = null;
  }

  get pickerOptions(): Survey[] {
    const term = this.pickerSearch.trim().toLowerCase();
    return this.allSurveys.filter(
      (s) =>
        !term ||
        (s.name || '').toLowerCase().includes(term) ||
        (s.description || '').toLowerCase().includes(term)
    );
  }

  attach(timepoint: SurveyTimepoint, survey: Survey): void {
    if (!survey?.id || this.isAttached(timepoint, survey.id)) return;
    this.persist({
      ...this.assigned,
      [timepoint]: [...this.idsAt(timepoint), survey.id],
    });
  }

  detach(timepoint: SurveyTimepoint, survey: Survey): void {
    if (!survey?.id) return;
    this.persist({
      ...this.assigned,
      [timepoint]: this.idsAt(timepoint).filter((id) => id !== survey.id),
    });
  }

  private persist(next: InterventionSurveys): void {
    if (!this.intervention?.id || this.isSaving) return;

    const previous = this.assigned;
    // Optimistic: the intervention document is not re-read here, so reflect the
    // change immediately and roll back if the write fails.
    this.assigned = next;
    this.buildRows();
    this.isSaving = true;

    this.interventionsService
      .setInterventionSurveys(this.intervention.id, next)
      .then(() => {
        this.intervention.surveys = next;
      })
      .catch((error) => {
        console.error('Saving intervention surveys failed', error);
        this.assigned = previous;
        this.buildRows();
        Utilities.displayToast(
          'error',
          Utilities.firestoreErrorMessage(error, 'Could not save the survey assignment.')
        );
      })
      .finally(() => { this.isSaving = false; });
  }

  questionCount(survey: Survey): number {
    const schema: any = survey?.schema;
    if (!schema) return 0;
    return (
      schema.elements?.length ||
      schema.pages?.reduce((n: number, p: any) => n + (p.elements?.length || 0), 0) ||
      0
    );
  }

  /** A survey that is attached but inactive or empty will never reach a client. */
  warningFor(survey: Survey): string {
    if (!this.questionCount(survey)) return 'No questions';
    if (!survey.active) return 'Draft — not visible in the app';
    return '';
  }

  trackById(_: number, survey: Survey) { return survey.id; }
}
