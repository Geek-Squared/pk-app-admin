import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Intervention } from 'src/app/models/intervention.interface';
import { InterventionSurveys } from 'src/app/models/survey.interface';
import { Utilities } from '../models/utils';

@Injectable({
  providedIn: 'root',
})
export class InterventionsService {
  constructor(private firestore: AngularFirestore) {}

  /**
   * New interventions always get a numeric `order`. Without one the document is
   * invisible to any `orderBy('order')` query — which is still how the mobile
   * app lists interventions — so an intervention with no order would be created
   * here and then never show up anywhere.
   */
  async createIntervention(intervention: Intervention) {
    const payload: any = { ...intervention };
    if (Utilities.orderValue(payload) === null) {
      payload.order = await this.nextOrder();
    } else {
      payload.order = Utilities.orderValue(payload);
    }
    return this.firestore.collection('interventions').add(payload);
  }

  deleteIntervention(interventionId: string) {
    return this.firestore
      .collection('interventions')
      .doc(interventionId)
      .delete();
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
    // No orderBy here: Firestore's orderBy('order') silently drops every
    // document that has no `order` field, which is why interventions created
    // outside this admin were missing from the list entirely while the app
    // still showed them. Consumers sort client-side with Utilities.byOrder.
    return this.firestore
      .collection<Intervention>('interventions')
      .snapshotChanges();
  }

  updateIntervention(intervention: Intervention) {
    const payload: any = { ...intervention };
    const order = Utilities.orderValue(payload);
    if (order === null) {
      // A blank order field must not wipe an existing one — that would hide the
      // intervention from the mobile app's ordered query.
      delete payload.order;
    } else {
      payload.order = order;
    }
    return this.firestore
      .collection('interventions')
      .doc(intervention.id)
      .set(payload, { merge: true });
  }

  /**
   * Writes the intervention's measurement surveys, keyed by timepoint:
   *
   *   interventions/{id}.surveys = { baseline: [...], midline: [...], endline: [...] }
   *
   * This is the contract the mobile app reads to decide which survey a client
   * is due. Written as a whole map rather than merged field-by-field so that
   * removing the last survey from a timepoint actually clears it.
   */
  setInterventionSurveys(interventionId: string, surveys: InterventionSurveys) {
    return this.firestore
      .collection('interventions')
      .doc(interventionId)
      .set({ surveys }, { merge: true });
  }

  /**
   * Assigns a numeric `order` to every intervention missing one, appended after
   * those already ordered. Repairs documents for the mobile app too, which
   * still queries with orderBy('order') and therefore cannot see them.
   *
   * Resolves with the number of documents repaired.
   */
  async backfillMissingOrder(): Promise<number> {
    const snapshot = await this.firestore
      .collection('interventions')
      .get()
      .toPromise();

    const docs = snapshot?.docs || [];
    const unordered = docs.filter(
      (doc) => Utilities.orderValue(doc.data()) === null
    );
    if (!unordered.length) {
      return 0;
    }

    let next = this.highestOrder(docs) + 1;
    const batch = this.firestore.firestore.batch();
    unordered
      .sort((a, b) =>
        ((a.data() as any)?.name || '').localeCompare((b.data() as any)?.name || '')
      )
      .forEach((doc) => {
        batch.set(doc.ref, { order: next++ }, { merge: true });
      });

    await batch.commit();
    return unordered.length;
  }

  /**
   * Best-effort: working out the next order requires reading the collection,
   * and that read must never be what stops an intervention being created. On
   * failure the document still gets a numeric order — it just sorts first,
   * which "Fix ordering" can tidy — rather than the create hanging or throwing.
   */
  private async nextOrder(): Promise<number> {
    try {
      const snapshot = await this.firestore
        .collection('interventions')
        .get()
        .toPromise();
      return this.highestOrder(snapshot?.docs || []) + 1;
    } catch (error) {
      console.error('Could not read existing interventions to pick an order', error);
      return 0;
    }
  }

  private highestOrder(docs: any[]): number {
    return docs.reduce((highest, doc) => {
      const value = Utilities.orderValue(doc.data());
      return value !== null && value > highest ? value : highest;
    }, 0);
  }
}
