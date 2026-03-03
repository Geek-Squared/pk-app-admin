import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

@Injectable({
  providedIn: 'root',
})
export class AdminNotificationsService {
  constructor(
    private firestore: AngularFirestore,
    private functions: AngularFireFunctions
  ) {}

  getNotifications() {
    return this.firestore
      .collection('adminNotifications', (ref) =>
        ref.orderBy('createdAt', 'desc')
      )
      .snapshotChanges();
  }

  sendTestNotification(message?: string) {
    return this.functions
      .httpsCallable('sendAdminTestNotification')({ message: message || '' });
  }
}
