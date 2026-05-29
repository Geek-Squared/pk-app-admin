import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SurveysService } from 'src/app/services';

@Component({
  selector: 'app-view-survey',
  templateUrl: './view-survey.component.html',
  styleUrls: ['./view-survey.component.scss'],
})
export class ViewSurveyComponent implements OnInit {
  public survey: any;
  public responses: any[] = [];
  public responseKeys: string[] = [];
  public isLoading = false;
  public toggling = false;

  constructor(private route: ActivatedRoute, private surveysService: SurveysService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.isLoading = true;
    this.surveysService.getSurvey(id).subscribe(s => { this.survey = s; this.isLoading = false; });
    this.surveysService.getResponses(id).subscribe(data => {
      this.responses = data.map((e: any) => ({ id: e.payload.doc.id, ...e.payload.doc.data() }));
      const keys = new Set<string>();
      this.responses.forEach(r => Object.keys(r).forEach(k => {
        if (!['id', 'createdAt', 'uid', 'userId', 'submittedAt'].includes(k)) keys.add(k);
      }));
      this.responseKeys = Array.from(keys);
    });
  }

  get questionCount(): number {
    if (!this.survey?.schema) return 0;
    const s = this.survey.schema;
    return s?.elements?.length || s?.pages?.reduce((n: number, p: any) => n + (p.elements?.length || 0), 0) || 0;
  }

  toggleActive() {
    if (!this.survey || this.toggling) return;
    this.toggling = true;
    this.surveysService.updateSurvey(this.survey.id, { active: !this.survey.active })
      .finally(() => { this.toggling = false; });
  }
}
