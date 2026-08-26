export type SurveyPhase = 'baseline' | 'midline' | 'endline';

export interface Survey {
  id?: string;
  name: string;
  description?: string;
  schema?: { title?: string; elements: any[] };
  active?: boolean;
  createdAt?: number;
  // Set on surveys that belong to an intervention's Before/Midline/Endline cycle.
  // Standalone surveys leave these unset.
  interventionId?: string;
  interventionName?: string;
  phase?: SurveyPhase;
  phaseOrder?: number;
}

export interface SurveyPhaseDefinition {
  phase: SurveyPhase;
  label: string;
  order: number;
  description: string;
}

/**
 * Every intervention carries these three surveys, in this order. `phase` is the
 * stable key stored on the survey document; `label` is what admins and clients
 * see. Keep the keys stable — the mobile app and any reporting keys off them.
 */
export const SURVEY_PHASES: SurveyPhaseDefinition[] = [
  {
    phase: 'baseline',
    label: 'Before',
    order: 1,
    description: 'Completed before the client starts this intervention.',
  },
  {
    phase: 'midline',
    label: 'Midline',
    order: 2,
    description: 'Completed part-way through this intervention.',
  },
  {
    phase: 'endline',
    label: 'Endline',
    order: 3,
    description: 'Completed once the client finishes this intervention.',
  },
];

export function surveyPhaseLabel(phase: SurveyPhase | string): string {
  return SURVEY_PHASES.find((p) => p.phase === phase)?.label || '';
}
