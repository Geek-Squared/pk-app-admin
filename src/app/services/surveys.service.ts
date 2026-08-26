import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';

/**
 * Surveys are standalone instruments. They are not owned by an intervention —
 * an intervention points at them by id, and the same survey is deliberately
 * reused across interventions and timepoints so responses stay comparable.
 * The attachment lives on the intervention (InterventionsService).
 */
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

  /**
   * Every response to this survey, across all interventions and timepoints.
   * Each response carries `interventionId` and `timepoint`, stamped by the app,
   * so the same instrument answered before and after remains two comparable
   * records rather than one overwriting the other.
   */
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
}
