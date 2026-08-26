import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Intervention } from 'src/app/models/intervention.interface';
import {
  SURVEY_TIMEPOINTS,
  normaliseInterventionSurveys,
  timepointLabel,
} from 'src/app/models/survey.interface';
import { InterventionsService, SurveysService } from 'src/app/services';

/** Where this survey is administered: one intervention, one timepoint. */
interface Placement {
  interventionId: string;
  interventionName: string;
  timepointLabel: string;
}

/** Response metadata is shown in its own columns, not as answer data. */
const META_KEYS = [
  'id',
  'createdAt',
  'uid',
  'userId',
  'userName',
  'submittedAt',
  'interventionId',
  'timepoint',
];

@Component({
  selector: 'app-view-survey',
  templateUrl: './view-survey.component.html',
  styleUrls: ['./view-survey.component.scss'],
})
export class ViewSurveyComponent implements OnInit {
  public survey: any;
  public responses: any[] = [];
  public responseKeys: string[] = [];
  public placements: Placement[] = [];
  public isLoading = false;
  public toggling = false;
  public isEditing = false;

  private interventionNames: Record<string, string> = {};

  constructor(
    private route: ActivatedRoute,
    private surveysService: SurveysService,
    private interventionsService: InterventionsService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.isLoading = true;
    this.surveysService.getSurvey(id).subscribe(s => { this.survey = s; this.isLoading = false; });

    this.surveysService.getResponses(id).subscribe(data => {
      this.responses = data.map((e: any) => ({ id: e.payload.doc.id, ...e.payload.doc.data() }));
      const keys = new Set<string>();
      this.responses.forEach(r => Object.keys(r).forEach(k => {
        if (!META_KEYS.includes(k)) keys.add(k);
      }));
      this.responseKeys = Array.from(keys);
    });

    // Which interventions administer this survey, and at which points. The
    // attachment lives on the intervention, so this is a reverse lookup.
    this.interventionsService.getInterventions().subscribe((data: any[]) => {
      const interventions = data.map(
        (e: any) => ({ id: e.payload.doc.id, ...e.payload.doc.data() } as Intervention)
      );
      this.interventionNames = {};
      interventions.forEach((i) => { this.interventionNames[i.id] = i.name; });

      const placements: Placement[] = [];
      interventions.forEach((intervention) => {
        const attached = normaliseInterventionSurveys(intervention.surveys);
        SURVEY_TIMEPOINTS.forEach((t) => {
          if ((attached[t.key] || []).includes(id)) {
            placements.push({
              interventionId: intervention.id,
              interventionName: intervention.name,
              timepointLabel: t.label,
            });
          }
        });
      });
      this.placements = placements;
    });
  }

  get questionCount(): number {
    if (!this.survey?.schema) return 0;
    const s = this.survey.schema;
    return s?.elements?.length || s?.pages?.reduce((n: number, p: any) => n + (p.elements?.length || 0), 0) || 0;
  }

  /** A survey with no questions has nothing for clients to answer. */
  get canActivate(): boolean {
    return this.questionCount > 0;
  }

  interventionName(id: string): string {
    return this.interventionNames[id] || id || '—';
  }

  timepointName(key: string): string {
    return timepointLabel(key) || key || '—';
  }

  toggleActive() {
    if (!this.survey || this.toggling) return;
    if (!this.survey.active && !this.canActivate) return;
    this.toggling = true;
    this.surveysService.updateSurvey(this.survey.id, { active: !this.survey.active })
      .finally(() => { this.toggling = false; });
  }
}
