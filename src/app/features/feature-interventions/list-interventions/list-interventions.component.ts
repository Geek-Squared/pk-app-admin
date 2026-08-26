import { Component, HostListener, Input, OnInit } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Intervention } from 'src/app/models/intervention.interface';
import { SURVEY_PHASES } from 'src/app/models/survey.interface';
import { Utilities } from 'src/app/models/utils';
import {
  InterventionsService,
  CategoriesService,
  WorkbooksService,
  SurveysService,
} from 'src/app/services';
import { ChaptersService } from 'src/app/services/chapters.service';

interface InterventionStats extends Intervention {
  categoryCount: number;
  chapterCount: number;
  clientCount: number;
  avgCompletion: number;
  surveyCount: number;
  surveysReady: boolean;
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
  public settingUpSurveysFor: string | null = null;
  public unorderedCount = 0;
  public isFixingOrder = false;
  public loadErrors: string[] = [];
  public isSettingUpAllSurveys = false;

  readonly totalPhases = SURVEY_PHASES.length;

  constructor(
    private interventionsService: InterventionsService,
    private categoriesService: CategoriesService,
    private chaptersService: ChaptersService,
    private workbooksService: WorkbooksService,
    private surveysService: SurveysService
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
      this.guard(this.interventionsService.getInterventions(), 'interventions'),
      this.guard(this.categoriesService.getCategories(), 'categories'),
      this.guard(this.chaptersService.getChapters(), 'chapters'),
      this.guard(this.workbooksService.getWorkbooks(), 'workbooks'),
      this.guard(this.surveysService.getSurveys(), 'surveys'),
    ]).subscribe(
      ([iData, cData, chData, wData, sData]) => {
        const interventions = iData.map((e: any) => ({ id: e.payload.doc.id, ...e.payload.doc.data() } as Intervention));
        const categories = cData.map((e: any) => e.payload.doc.data() as any);
        const chapters = chData.map((e: any) => ({ id: e.payload.doc.id, ...e.payload.doc.data() } as any));
        const workbooks = wData.map((e: any) => e.payload.doc.data() as any);
        const surveys = sData.map((e: any) => e.payload.doc.data() as any);
        // Documents with no usable `order` are still hidden from the mobile app,
        // which lists interventions with orderBy('order').
        this.unorderedCount = interventions.filter(
          (i) => Utilities.orderValue(i) === null
        ).length;
        this.interventions = this.computeStats(interventions, categories, chapters, workbooks, surveys)
          .sort(Utilities.byOrder);
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
    workbooks: any[],
    surveys: any[]
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

    // Distinct survey phases present per intervention. Counting phases rather
    // than documents keeps the tally at 3 even if a duplicate ever sneaks in.
    const phasesByIntervention = new Map<string, Set<string>>();
    surveys.forEach((s) => {
      if (!s?.interventionId || !s?.phase) return;
      if (!phasesByIntervention.has(s.interventionId)) {
        phasesByIntervention.set(s.interventionId, new Set<string>());
      }
      phasesByIntervention.get(s.interventionId)!.add(s.phase);
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
      const surveyCount = phasesByIntervention.get(intv.id)?.size || 0;

      return {
        ...intv,
        categoryCount: categoryCounts.get(intv.id) || 0,
        chapterCount: totalChapters,
        clientCount,
        avgCompletion,
        surveyCount,
        surveysReady: surveyCount >= this.totalPhases,
      };
    });
  }

  get interventionsMissingSurveys(): InterventionStats[] {
    return this.interventions.filter((i) => !i.surveysReady);
  }

  /** Creates any missing Before / Midline / Endline surveys for one intervention. */
  setupSurveys(event: Event, intervention: Intervention) {
    event.stopPropagation();
    event.preventDefault();
    this.openMenuId = null;

    if (this.settingUpSurveysFor) return;
    this.settingUpSurveysFor = intervention.id;

    this.surveysService
      .ensurePhaseSurveys(intervention)
      .then((created) => {
        Utilities.displayToast(
          'success',
          created
            ? `Added ${created} draft ${created === 1 ? 'survey' : 'surveys'} to ${intervention.name}.`
            : `${intervention.name} already has all ${this.totalPhases} surveys.`
        );
      })
      .catch((error) => {
        console.error('Set up surveys failed', error);
        Utilities.displayToast(
          'error',
          Utilities.firestoreErrorMessage(error, 'Could not set up the surveys. Please try again.')
        );
      })
      .finally(() => { this.settingUpSurveysFor = null; });
  }

  /** Backfills every intervention that is missing one or more phase surveys. */
  setupAllSurveys() {
    const missing = this.interventionsMissingSurveys;
    if (this.isSettingUpAllSurveys || !missing.length) return;

    this.isSettingUpAllSurveys = true;
    this.surveysService
      .ensurePhaseSurveysForAll(missing)
      .then((created) => {
        Utilities.displayToast(
          'success',
          created
            ? `Added ${created} draft ${created === 1 ? 'survey' : 'surveys'} across ${missing.length} ${missing.length === 1 ? 'intervention' : 'interventions'}.`
            : 'Every intervention already has its surveys.'
        );
      })
      .catch((error) => {
        console.error('Bulk set up surveys failed', error);
        Utilities.displayToast(
          'error',
          Utilities.firestoreErrorMessage(error, 'Could not set up all surveys. Please try again.')
        );
      })
      .finally(() => { this.isSettingUpAllSurveys = false; });
  }

  /**
   * One failing collection must not blank the whole page. A stream that errors
   * yields an empty list and is named in `loadErrors`, instead of tearing down
   * the combineLatest and leaving the list looking simply empty.
   */
  private guard<T>(source: Observable<T[]>, name: string): Observable<T[]> {
    return source.pipe(
      catchError((error) => {
        console.error(`Interventions page: failed to load ${name}`, error);
        if (!this.loadErrors.includes(name)) {
          this.loadErrors.push(name);
        }
        return of([] as T[]);
      })
    );
  }

  /** Gives interventions with no `order` one, so the app can list them too. */
  fixOrdering() {
    if (this.isFixingOrder || !this.unorderedCount) return;

    this.isFixingOrder = true;
    this.interventionsService
      .backfillMissingOrder()
      .then((fixed) => {
        Utilities.displayToast(
          'success',
          fixed
            ? `Ordered ${fixed} ${fixed === 1 ? 'intervention' : 'interventions'}. They will now appear in the app as well.`
            : 'Every intervention already has an order.'
        );
      })
      .catch((error) => {
        console.error('Fix ordering failed', error);
        Utilities.displayToast(
          'error',
          Utilities.firestoreErrorMessage(error, 'Could not update the ordering. Please try again.')
        );
      })
      .finally(() => { this.isFixingOrder = false; });
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
