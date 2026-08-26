import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Referral } from 'src/app/models/referral.interface';

@Injectable({
  providedIn: 'root',
})
export class ReferralsService {
  constructor(private firestore: AngularFirestore) {}

  createReferral(referral: Referral) {
    return this.firestore.collection('referrals').add(referral);
  }

  deleteReferral(referralId: string) {
    return this.firestore.collection('referrals').doc(referralId).delete();
  }

  getReferralById(referralId: string) {
    return this.firestore
      .collection('referrals')
      .doc<Referral>(referralId)
      .snapshotChanges()
      .pipe(
        map((doc: any) => {
          return { id: doc.payload.id, ...doc.payload.data() };
        })
      );
  }

  getReferrals() {
    // No orderBy: Firestore's orderBy('order') silently drops any referral
    // missing the `order` field. Consumers sort client-side.
    return this.firestore
      .collection<Referral>('referrals')
      .snapshotChanges();
  }

  updateReferral(referral: Referral) {
    return this.firestore
      .collection('referrals')
      .doc(referral.id)
      .set(referral, { merge: true });
  }
}
