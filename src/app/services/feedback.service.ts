import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  constructor(private firestore: AngularFirestore) {}

  getFeedback() {
    return this.firestore
      .collection<any>('feedback', (ref) => ref.orderBy('createdDate'))
      .snapshotChanges();
  }
}
