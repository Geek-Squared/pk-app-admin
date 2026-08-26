export interface Survey {
  id?: string;
  name: string;
  description?: string;
  schema?: { title?: string; elements: any[] };
  active?: boolean;
  createdAt?: number;
}

/**
 * The measurement points an intervention is assessed at. `key` is what is
 * stored and what the mobile app matches on — keep these stable.
 */
export type SurveyTimepoint = 'baseline' | 'midline' | 'endline';

/**
 * Which surveys an intervention administers, by timepoint. Stored on the
 * intervention as `interventions/{id}.surveys`.
 *
 * Arrays of survey ids rather than a single id, so an intervention can run
 * several instruments at one point AND — more importantly — so the SAME
 * instrument can run at all three. Measuring change means asking the same
 * questions before, during and after; three separately authored surveys would
 * not be comparable.
 */
export interface InterventionSurveys {
  baseline?: string[];
  midline?: string[];
  endline?: string[];
}

export interface SurveyTimepointDefinition {
  key: SurveyTimepoint;
  label: string;
  order: number;
  /** How the app decides this timepoint is the current one. */
  trigger: string;
}

/**
 * The app derives the current timepoint from chapter completion, which the
 * workbook already records — there is no separate schedule to drift out of
 * sync. These descriptions must stay in step with
 * InterventionSurveysService.timepointFor() in the mobile app.
 */
export const SURVEY_TIMEPOINTS: SurveyTimepointDefinition[] = [
  {
    key: 'baseline',
    label: 'Before',
    order: 1,
    trigger: 'Shown before the client completes any chapter of this intervention.',
  },
  {
    key: 'midline',
    label: 'Midline',
    order: 2,
    trigger: 'Shown once at least half the chapters are complete.',
  },
  {
    key: 'endline',
    label: 'Endline',
    order: 3,
    trigger: 'Shown once every chapter is complete.',
  },
];

export function timepointLabel(timepoint: SurveyTimepoint | string): string {
  return SURVEY_TIMEPOINTS.find((t) => t.key === timepoint)?.label || '';
}

/** Normalises the stored map, tolerating a missing or partial `surveys` field. */
export function normaliseInterventionSurveys(value: any): InterventionSurveys {
  const read = (key: SurveyTimepoint): string[] =>
    Array.isArray(value?.[key]) ? value[key].filter((id: any) => !!id) : [];

  return {
    baseline: read('baseline'),
    midline: read('midline'),
    endline: read('endline'),
  };
}
