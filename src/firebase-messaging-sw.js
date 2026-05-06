/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/9.0.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyAyQhv2xlj15JF7_o7DbBLRSB4XTXQL1FQ',
  authDomain: 'positive-konnections-42d8a.firebaseapp.com',
  projectId: 'positive-konnections-42d8a',
  storageBucket: 'positive-konnections-42d8a.appspot.com',
  messagingSenderId: '803337097020',
  appId: '1:803337097020:web:ba78819354d9754930d839',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload?.notification?.title || 'Positive Konnections';
  const options = {
    body: payload?.notification?.body || 'You have a new notification.',
    data: payload?.data || {},
  };

  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const data = event.notification?.data || {};
  const url = buildNotificationUrl(data);

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        for (const client of clients) {
          if ('focus' in client) {
            client.focus();
            if ('navigate' in client) {
              return client.navigate(url);
            }
            return undefined;
          }
        }

        if (self.clients.openWindow) {
          return self.clients.openWindow(url);
        }

        return undefined;
      })
  );
});

function buildNotificationUrl(data) {
  if (!data?.userId) {
    return '/notifications';
  }

  const params = new URLSearchParams();
  if (data.workbookId) {
    params.set('workbookId', data.workbookId);
  }
  if (data.chapterId) {
    params.set('chapterId', data.chapterId);
  }
  if (data.postId) {
    params.set('postId', data.postId);
  }

  const query = params.toString();
  return `/work-books/view-details/${data.userId}${query ? `?${query}` : ''}`;
}
