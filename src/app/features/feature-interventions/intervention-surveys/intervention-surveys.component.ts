import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Intervention } from 'src/app/models/intervention.interface';
import {
  SURVEY_PHASES,
  Survey,
  SurveyPhaseDefinition,
} from 'src/app/models/survey.interface';
import { Utilities } from 'src/app/models/utils';
import { SurveysService } from 'src/app/services';

interface PhaseRow extends SurveyPhaseDefinition {
  survey: Survey | null;
  questionCount: number;
}

@Component({
  selector: 'app-intervention-surveys',
  templateUrl: './intervention-surveys.component.html',
  styleUrls: ['./intervention-surveys.component.scss'],
})
export class InterventionSurveysComponent implements OnChanges, OnDestroy {
  @Input() intervention: Intervention;

  public rows: PhaseRow[] = [];
  public isLoading = false;
  public isSettingUp = false;

  private subscription: Subscription | null = null;

  constructor(private surveysService: SurveysService) {}

  ngOnChanges(): void {
    this.subscription?.unsubscribe();
    this.rows = [];

    if (!this.intervention?.id) {
      return;
    }

    this.isLoading = true;
    this.subscription = this.surveysService
      .getSurveysByInterventionId(this.intervention.id)
      .subscribe(
        (data: any[]) => {
          const surveys: Survey[] = data.map((e: any) => ({
            id: e.payload.doc.id,
            ...e.payload.doc.data(),
          }));
          this.rows = SURVEY_PHASES.map((definition) => {
            const survey = surveys.find((s) => s.phase === definition.phase) || null;
            return {
              ...definition,
              survey,
              questionCount: this.countQuestions(survey),
            };
          });
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  get missingCount(): number {
    return this.rows.filter((r) => !r.survey).length;
  }

  setupSurveys(): void {
    if (this.isSettingUp || !this.intervention?.id) return;

    this.isSettingUp = true;
    this.surveysService
      .ensurePhaseSurveys(this.intervention)
      .then((created) => {
        if (created) {
          Utilities.displayToast(
            'success',
            `Added ${created} draft ${created === 1 ? 'survey' : 'surveys'}. Add questions, then activate to release ${created === 1 ? 'it' : 'them'} to clients.`
          );
        }
      })
      .catch((error) => {
        console.error('Set up surveys failed', error);
        Utilities.displayToast(
          'error',
          Utilities.firestoreErrorMessage(error, 'Could not set up the surveys. Please try again.')
        );
      })
      .finally(() => {
        this.isSettingUp = false;
      });
  }

  private countQuestions(survey: Survey | null): number {
    const schema: any = survey?.schema;
    if (!schema) return 0;
    return (
      schema.elements?.length ||
      schema.pages?.reduce((n: number, p: any) => n + (p.elements?.length || 0), 0) ||
      0
    );
  }
}
