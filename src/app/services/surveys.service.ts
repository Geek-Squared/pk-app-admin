import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';

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
}
