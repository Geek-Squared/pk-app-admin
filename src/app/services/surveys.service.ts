import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Intervention } from '../models/intervention.interface';
import { SURVEY_PHASES, SurveyPhase } from '../models/survey.interface';

@Injectable({ providedIn: 'root' })
export class SurveysService {
  constructor(private firestore: AngularFirestore) {}

  getSurveys() {
    return this.firestore.collection('surveys').snapshotChanges();
  }

  getSurvey(id: string) {
    return this.firestore.collection('surveys').doc<any>(id).snapshotChanges().pipe(
      map((doc: any) => ({ id: doc.payload.id, ...doc.payload.data() }))
    );
  }

  getResponses(surveyId: string) {
    return this.firestore
      .collection('surveys').doc(surveyId)
      .collection('responses')
      .snapshotChanges();
  }

  createSurvey(survey: any) {
    return this.firestore.collection('surveys').add({
      ...survey,
      createdAt: Date.now(),
    });
  }

  updateSurvey(id: string, survey: any) {
    return this.firestore.collection('surveys').doc(id).set(survey, { merge: true });
  }

  deleteSurvey(id: string) {
    return this.firestore.collection('surveys').doc(id).delete();
  }

  /** The Before / Midline / Endline surveys belonging to one intervention. */
  getSurveysByInterventionId(interventionId: string) {
    return this.firestore
      .collection<any>('surveys', (ref) =>
        ref.where('interventionId', '==', interventionId)
      )
      .snapshotChanges();
  }

  /**
   * Creates whichever of the three phase surveys (Before / Midline / Endline)
   * this intervention does not already have, as empty drafts for an admin to
   * fill in. Idempotent — phases that already exist are left untouched, so this
   * is safe to run repeatedly and safe to run from two tabs at once.
   *
   * Resolves with the number of surveys actually created.
   */
  async ensurePhaseSurveys(intervention: Intervention): Promise<number> {
    if (!intervention?.id) {
      return 0;
    }

    const snapshot = await this.firestore
      .collection('surveys', (ref) =>
        ref.where('interventionId', '==', intervention.id)
      )
      .get()
      .toPromise();

    const existingPhases = new Set<SurveyPhase>(
      (snapshot?.docs || [])
        .map((doc) => (doc.data() as any)?.phase)
        .filter(Boolean)
    );

    const missing = SURVEY_PHASES.filter((p) => !existingPhases.has(p.phase));
    if (!missing.length) {
      return 0;
    }

    const batch = this.firestore.firestore.batch();
    missing.forEach((p) => {
      const name = this.phaseSurveyName(intervention.name, p.label);
      batch.set(this.firestore.collection('surveys').doc().ref, {
        name,
        description: p.description,
        interventionId: intervention.id,
        interventionName: intervention.name || '',
        phase: p.phase,
        phaseOrder: p.order,
        // Empty shell — an admin adds the questions before activating it.
        schema: { title: name, elements: [] },
        active: false,
        createdAt: Date.now(),
      });
    });

    await batch.commit();
    return missing.length;
  }

  /**
   * Keeps an intervention's phase surveys in step after it is renamed: the
   * denormalised `interventionName` is always refreshed, and the survey's own
   * title is regenerated only while it still matches the name we generated —
   * a title an admin has since customised is left untouched.
   */
  async syncInterventionName(
    intervention: Intervention,
    previousName: string
  ): Promise<void> {
    if (!intervention?.id) {
      return;
    }

    const snapshot = await this.firestore
      .collection('surveys', (ref) =>
        ref.where('interventionId', '==', intervention.id)
      )
      .get()
      .toPromise();

    const docs = snapshot?.docs || [];
    if (!docs.length) {
      return;
    }

    const batch = this.firestore.firestore.batch();
    docs.forEach((doc) => {
      const data: any = doc.data();
      const update: any = { interventionName: intervention.name || '' };

      const phase = SURVEY_PHASES.find((p) => p.phase === data?.phase);
      if (phase && data?.name === this.phaseSurveyName(previousName, phase.label)) {
        const name = this.phaseSurveyName(intervention.name, phase.label);
        update.name = name;
        update['schema.title'] = name;
      }

      batch.update(doc.ref, update);
    });

    await batch.commit();
  }

  /**
   * Removes the phase surveys belonging to an intervention. Called when the
   * intervention itself is deleted so its surveys do not linger in the surveys
   * list — or, if they were active, on clients' devices.
   */
  async deleteSurveysByInterventionId(interventionId: string): Promise<number> {
    if (!interventionId) {
      return 0;
    }

    const snapshot = await this.firestore
      .collection('surveys', (ref) => ref.where('interventionId', '==', interventionId))
      .get()
      .toPromise();

    const docs = snapshot?.docs || [];
    if (!docs.length) {
      return 0;
    }

    const batch = this.firestore.firestore.batch();
    docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    return docs.length;
  }

  /**
   * Runs ensurePhaseSurveys across many interventions, and resolves with the
   * total number of surveys created.
   */
  async ensurePhaseSurveysForAll(interventions: Intervention[]): Promise<number> {
    let created = 0;
    for (const intervention of interventions || []) {
      created += await this.ensurePhaseSurveys(intervention);
    }
    return created;
  }

  private phaseSurveyName(interventionName: string, phaseLabel: string): string {
    const base = (interventionName || 'Intervention').trim();
    return `${base} — ${phaseLabel} Survey`;
  }
}
