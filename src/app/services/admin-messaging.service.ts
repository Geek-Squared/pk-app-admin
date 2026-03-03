import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import firebase from 'firebase/compat/app';
import {
  getApps,
  initializeApp,
} from 'firebase/app';
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  Messaging,
} from 'firebase/messaging';

@Injectable({
  providedIn: 'root',
})
export class AdminMessagingService {
  private initPromise: Promise<void> | null = null;
  private messaging: Messaging | null = null;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private zone: NgZone
  ) {}

  init(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.initialize();
    return this.initPromise;
  }

  private async initialize(): Promise<void> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    const supported = await isSupported().catch(() => false);
    if (!supported) {
      return;
    }

    if (!getApps().length) {
      initializeApp(environment.firebaseConfig);
    }

    this.messaging = getMessaging();

    const user = await this.afAuth.currentUser;
    if (!user) {
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return;
    }

    if (
      !environment.fcmVapidKey ||
      environment.fcmVapidKey.startsWith('REPLACE_')
    ) {
      console.warn('FCM VAPID key is not configured.');
      return;
    }

    let registration: ServiceWorkerRegistration | undefined;
    if ('serviceWorker' in navigator) {
      registration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js'
      );
    }

    const token = await getToken(this.messaging, {
      vapidKey: environment.fcmVapidKey,
      serviceWorkerRegistration: registration,
    }).catch((error) => {
      console.warn('Unable to get FCM token', error);
      return null;
    });

    if (token) {
      await this.storeToken(user.uid, token);
    }

    onMessage(this.messaging, (payload) => {
      this.zone.run(() => {
        console.log('Foreground message received', payload);
      });
    });
  }

  private storeToken(uid: string, token: string): Promise<void> {
    return this.afs
      .collection('users')
      .doc(uid)
      .set(
        {
          webFcmTokens: firebase.firestore.FieldValue.arrayUnion(token),
          webFcmTokensUpdatedAt: Date.now(),
        },
        { merge: true }
      );
  }
}
