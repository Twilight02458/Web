importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBLhrN2vZqhU5xrPXN7iMqHcdQIa0af6_4",
  authDomain: "chatfeature-7110c.firebaseapp.com",
  projectId: "chatfeature-7110c",
  storageBucket: "chatfeature-7110c.firebasestorage.app",
  messagingSenderId: "200310536236",
  appId: "1:200310536236:web:d358707af72a7294edf989",
  measurementId: "G-2FPKQWC5KY"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png',
    badge: '/logo192.png',
    data: payload.data,
    requireInteraction: true, // Keep notification visible until user interacts
    actions: [
      {
        action: 'open',
        title: 'Open'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.', event);

  event.notification.close();

  if (event.action === 'open') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
}); 