import { Component, OnInit } from '@angular/core';
import { SurveysService } from 'src/app/services';

@Component({
  selector: 'app-list-surveys',
  templateUrl: './list-surveys.component.html',
  styleUrls: ['./list-surveys.component.scss'],
})
export class ListSurveysComponent implements OnInit {
  public surveys: any[] = [];
  public filteredSurveys: any[] = [];
  public isLoading = false;
  public isCreate = false;
  public searchTerm = '';

  constructor(private surveysService: SurveysService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.surveysService.getSurveys().subscribe(
      (data) => {
        this.surveys = data
          .map((e: any) => ({ id: e.payload.doc.id, ...e.payload.doc.data() }))
          .filter((s: any) => s?.name && typeof s.name === 'string' && s.name.trim().length > 0);
        this.applyFilter();
        this.isLoading = false;
      },
      () => { this.isLoading = false; }
    );
  }

  onSearchTermChange(value: string) { this.searchTerm = value; this.applyFilter(); }

  private applyFilter() {
    const term = (this.searchTerm || '').trim().toLowerCase();
    this.filteredSurveys = term
      ? this.surveys.filter(s =>
          (s.name || '').toLowerCase().includes(term) ||
          (s.description || '').toLowerCase().includes(term))
      : [...this.surveys];
  }

  questionCount(s: any): number {
    try {
      const schema = typeof s?.schema === 'string' ? JSON.parse(s.schema) : s?.schema;
      return (schema?.elements?.length) || (schema?.pages?.reduce((n: number, p: any) => n + (p.elements?.length || 0), 0)) || 0;
    } catch { return 0; }
  }
}
