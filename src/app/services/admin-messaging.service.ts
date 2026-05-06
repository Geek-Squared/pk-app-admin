import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import iziToast from 'izitoast';
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
  private permissionToastShown = false;
  private foregroundHandlerRegistered = false;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
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
      this.showNotificationsUnavailableToast();
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

    this.registerForegroundHandler();

    if (Notification.permission === 'granted') {
      const enabled = await this.enableMessagingForUser(user.uid);
      enabled
        ? this.showNotificationsEnabledToast()
        : this.showNotificationsUnavailableToast();
      return;
    }

    if (Notification.permission === 'denied') {
      this.showNotificationsBlockedToast();
      return;
    }

    this.showNotificationPermissionToast(user.uid);
  }

  private async enableMessagingForUser(uid: string): Promise<boolean> {
    if (!this.messaging) {
      return false;
    }

    if (
      !environment.fcmVapidKey ||
      environment.fcmVapidKey.startsWith('REPLACE_')
    ) {
      console.warn('FCM VAPID key is not configured.');
      return false;
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
      await this.storeToken(uid, token);
      console.log('Admin web FCM token registered.');
      return true;
    }

    return false;
  }

  private registerForegroundHandler(): void {
    if (!this.messaging || this.foregroundHandlerRegistered) {
      return;
    }

    this.foregroundHandlerRegistered = true;
    onMessage(this.messaging, (payload) => {
      this.zone.run(() => {
        console.log('Foreground message received', payload);
        this.showForegroundNotification(payload);
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

  private showNotificationPermissionToast(uid: string): void {
    if (this.permissionToastShown) {
      return;
    }

    this.permissionToastShown = true;
    iziToast.question({
      id: 'admin-notification-permission',
      title: 'Enable notifications',
      message: 'Allow browser notifications for completed workbooks.',
      position: 'topRight',
      timeout: false as any,
      close: true,
      overlay: false,
      displayMode: 2,
      zindex: 99999,
      buttons: [
        [
          '<button><b>Enable</b></button>',
          async (instance: any, toast: any) => {
            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
            const permission = await Notification.requestPermission();
            if (permission === 'denied') {
              this.showNotificationsBlockedToast();
              return;
            }
            if (permission !== 'granted') {
              this.permissionToastShown = false;
              this.showNotificationsNotEnabledToast();
              return;
            }

            const enabled = await this.enableMessagingForUser(uid);
            enabled
              ? this.showNotificationsEnabledToast()
              : this.showNotificationsUnavailableToast();
          },
          true,
        ],
        [
          '<button>Later</button>',
          (instance: any, toast: any) => {
            instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
          },
        ],
      ] as any,
    });
  }

  private showNotificationsEnabledToast(): void {
    iziToast.success({
      id: 'admin-notifications-enabled',
      title: 'Notifications enabled',
      message: 'Workbook completion alerts will appear on this device.',
      position: 'topRight',
      timeout: 5000,
      displayMode: 2,
      zindex: 99999,
    });
  }

  private showNotificationsBlockedToast(): void {
    iziToast.warning({
      id: 'admin-notifications-blocked',
      title: 'Notifications blocked',
      message: 'Enable notifications in your browser settings to receive workbook alerts.',
      position: 'topRight',
      timeout: 10000,
      displayMode: 2,
      zindex: 99999,
    });
  }

  private showNotificationsNotEnabledToast(): void {
    iziToast.info({
      id: 'admin-notifications-not-enabled',
      title: 'Notifications not enabled',
      message: 'Use Enable notifications when you are ready to receive workbook alerts.',
      position: 'topRight',
      timeout: 7000,
      displayMode: 2,
      zindex: 99999,
    });
  }

  private showNotificationsUnavailableToast(): void {
    iziToast.warning({
      id: 'admin-notifications-unavailable',
      title: 'Notifications unavailable',
      message: 'This browser or URL cannot receive Firebase web notifications.',
      position: 'topRight',
      timeout: 10000,
      displayMode: 2,
      zindex: 99999,
    });
  }

  private showForegroundNotification(payload: any): void {
    if (Notification.permission !== 'granted') {
      return;
    }

    const title = payload?.notification?.title || 'Positive Konnections';
    const notification = new Notification(title, {
      body: payload?.notification?.body || 'You have a new notification.',
      data: payload?.data || {},
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
      this.navigateFromPayload(payload?.data || {});
    };
  }

  private navigateFromPayload(data: any): void {
    if (!data?.userId) {
      this.router.navigate(['/notifications']);
      return;
    }

    const queryParams: any = {};
    if (data.workbookId) {
      queryParams.workbookId = data.workbookId;
    }
    if (data.chapterId) {
      queryParams.chapterId = data.chapterId;
    }
    if (data.postId) {
      queryParams.postId = data.postId;
    }

    this.router.navigate(['/work-books/view-details', data.userId], {
      queryParams,
    });
  }
}
