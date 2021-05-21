import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Intervention } from "src/app/models/intervention.interface";

@Injectable({
  providedIn: 'root'
})
export class InterventionsService {
  constructor(private firestore: AngularFirestore) {}

  createIntervention(intervention: Intervention) {
    return this.firestore.collection('interventions').add(intervention);
  }

  deleteIntervention(interventionId: string) {
    return this.firestore.collection('interventions').doc(interventionId).delete();
  }

  getInterventionById(interventionId: string) {
    return this.firestore
      .collection('interventions')
      .doc<Intervention>(interventionId)
      .snapshotChanges()
      .pipe(
        map((doc: any) => {
          return { id: doc.payload.id, ...doc.payload.data() };
        })
      );
  }

  getInterventions() {
    return this.firestore
      .collection<Intervention>('interventions', (ref) => ref.orderBy('order'))
      .snapshotChanges();
  }

  updateIntervention(intervention: Intervention) {
    return this.firestore
      .collection('interventions')
      .doc(intervention.id)
      .set(intervention, { merge: true });
  }

  getInterventionsByInterventionId(interventionId: string) {
    return this.firestore
      .collection<any>('interventions', (ref) =>
        ref.where('interventionId', '==', interventionId).orderBy('order')
      )
      .snapshotChanges();
  }
}
