importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAdXMi37-Rv-0hV6teopW2FMwoud9mjGaU",
  authDomain: "svdd-c3198.firebaseapp.com",
  projectId: "svdd-c3198",
  storageBucket: "svdd-c3198.firebasestorage.app",
  messagingSenderId: "849894574211",
  appId: "1:849894574211:web:2e8465d84311bdceb3b3b6",
  measurementId: "G-8RYP5L2D6P"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.data.title || 'New Notification';
  const notificationOptions = {
    body: payload.data.body || 'You have a new message',
    icon: payload.data.icon || '/path/to/default/icon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});