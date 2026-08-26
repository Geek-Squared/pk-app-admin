import { InterventionSurveys } from './survey.interface';

export interface Intervention {
  name: string;
  createdDate: string;
  id: string;
  order?: number;
  visibility?: 'all' | 'restricted';
  allowedUserIds?: string[];
  /**
   * Measurement surveys by timepoint. Read by the mobile app to decide which
   * survey a client is due to complete. See survey.interface.ts.
   */
  surveys?: InterventionSurveys;
}
