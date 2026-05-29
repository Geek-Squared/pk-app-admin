import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import firebase from 'firebase/compat/app';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AdminNotificationsService {
  constructor(private firestore: AngularFirestore, private functions: AngularFireFunctions) {}

  getNotifications() {
    return this.firestore
      .collection('adminNotifications', (ref) => ref.orderBy('createdAt', 'desc'))
      .snapshotChanges();
  }

  getNotificationsValue() {
    return this.firestore
      .collection('adminNotifications', (ref) =>
        ref.orderBy('createdAt', 'desc')
      )
      .valueChanges({ idField: 'id' });
  }

  getUnreadCount(uid: string) {
    return this.getNotificationsValue().pipe(
      map((notifications: any[]) => {
        if (!uid) {
          return 0;
        }
        return notifications.filter(
          (item) => !item?.readBy || !item.readBy[uid]
        ).length;
      })
    );
  }

  markAsRead(notificationId: string, uid: string) {
    if (!notificationId || !uid) {
      return Promise.resolve();
    }
    return this.firestore
      .collection('adminNotifications')
      .doc(notificationId)
      .update({
        [`readBy.${uid}`]: firebase.firestore.FieldValue.serverTimestamp(),
      });
  }

  sendTestNotification(message?: string) {
    return this.functions.httpsCallable('sendAdminTestNotification')({ message: message || '' });
  }

  sendBroadcast(title: string, body: string) {
    return this.functions.httpsCallable('sendUserBroadcastNotification')({ title, body });
  }
}
