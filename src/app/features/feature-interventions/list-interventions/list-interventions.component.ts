import { Component, HostListener, Input, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { Intervention } from 'src/app/models/intervention.interface';
import {
  InterventionsService,
  CategoriesService,
  WorkbooksService,
} from 'src/app/services';
import { ChaptersService } from 'src/app/services/chapters.service';

interface InterventionStats extends Intervention {
  categoryCount: number;
  chapterCount: number;
  clientCount: number;
  avgCompletion: number;
}

@Component({
  selector: 'app-list-interventions',
  templateUrl: './list-interventions.component.html',
  styleUrls: ['./list-interventions.component.scss'],
})
export class ListInterventionsComponent implements OnInit {
  @Input() categoryId: string;
  public isCreate = false;
  public isUpdate = false;
  public isDelete = false;
  public interventions: InterventionStats[] = [];
  public filteredInterventions: InterventionStats[] = [];
  public isLoading = false;
  public searchTerm = '';
  public openMenuId: string | null = null;
  public selectedIntervention: Intervention | null = null;

  constructor(
    private interventionsService: InterventionsService,
    private categoriesService: CategoriesService,
    private chaptersService: ChaptersService,
    private workbooksService: WorkbooksService
  ) {}

  @HostListener('document:click')
  closeMenus() {
    this.openMenuId = null;
  }

  toggleMenu(event: Event, intervention: Intervention) {
    event.stopPropagation();
    event.preventDefault();
    this.openMenuId = this.openMenuId === intervention.id ? null : intervention.id;
  }

  editIntervention(event: Event, intervention: Intervention) {
    event.stopPropagation();
    event.preventDefault();
    this.selectedIntervention = intervention;
    this.openMenuId = null;
    this.isUpdate = true;
  }

  deleteIntervention(event: Event, intervention: Intervention) {
    event.stopPropagation();
    event.preventDefault();
    this.selectedIntervention = intervention;
    this.openMenuId = null;
    this.isDelete = true;
  }

  ngOnInit(): void {
    this.isLoading = true;
    combineLatest([
      this.interventionsService.getInterventions(),
      this.categoriesService.getCategories(),
      this.chaptersService.getChapters(),
      this.workbooksService.getWorkbooks(),
    ]).subscribe(
      ([iData, cData, chData, wData]) => {
        const interventions = iData.map((e: any) => ({ id: e.payload.doc.id, ...e.payload.doc.data() } as Intervention));
        const categories = cData.map((e: any) => e.payload.doc.data() as any);
        const chapters = chData.map((e: any) => ({ id: e.payload.doc.id, ...e.payload.doc.data() } as any));
        const workbooks = wData.map((e: any) => e.payload.doc.data() as any);
        this.interventions = this.computeStats(interventions, categories, chapters, workbooks);
        this.applyFilter();
        this.isLoading = false;
      },
      () => { this.isLoading = false; }
    );
  }

  private computeStats(
    interventions: Intervention[],
    categories: any[],
    chapters: any[],
    workbooks: any[]
  ): InterventionStats[] {
    // Categories per intervention
    const categoryCounts = new Map<string, number>();
    categories.forEach((c) => {
      if (!c?.interventionId) return;
      categoryCounts.set(c.interventionId, (categoryCounts.get(c.interventionId) || 0) + 1);
    });

    // Chapter ids per intervention (used to attribute completion)
    const chapterIdsByIntervention = new Map<string, Set<string>>();
    chapters.forEach((ch) => {
      if (!ch?.interventionId) return;
      if (!chapterIdsByIntervention.has(ch.interventionId)) {
        chapterIdsByIntervention.set(ch.interventionId, new Set<string>());
      }
      chapterIdsByIntervention.get(ch.interventionId)!.add(ch.id);
    });

    return interventions.map((intv) => {
      const chapterIds = chapterIdsByIntervention.get(intv.id) || new Set<string>();
      const totalChapters = chapterIds.size;

      let clientCount = 0;
      let completionSum = 0;
      workbooks.forEach((wb) => {
        const completed = Object.keys(wb?.completedChapters || {});
        const completedHere = completed.filter((id) => chapterIds.has(id)).length;
        if (completedHere > 0) {
          clientCount++;
          completionSum += totalChapters ? Math.min(completedHere / totalChapters, 1) : 0;
        }
      });

      const avgCompletion = clientCount ? Math.round((completionSum / clientCount) * 100) : 0;

      return {
        ...intv,
        categoryCount: categoryCounts.get(intv.id) || 0,
        chapterCount: totalChapters,
        clientCount,
        avgCompletion,
      };
    });
  }

  onSearchTermChange(value: string) {
    this.searchTerm = value;
    this.applyFilter();
  }

  private applyFilter() {
    const term = (this.searchTerm || '').trim().toLowerCase();
    this.filteredInterventions = term
      ? this.interventions.filter(i => (i.name || '').toLowerCase().includes(term))
      : [...this.interventions];
  }
}
