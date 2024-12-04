import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyAdXMi37-Rv-0hV6teopW2FMwoud9mjGaU",
  authDomain: "svdd-c3198.firebaseapp.com",
  projectId: "svdd-c3198",
  storageBucket: "svdd-c3198.firebasestorage.app",
  messagingSenderId: "849894574211",
  appId: "1:849894574211:web:2e8465d84311bdceb3b3b6",
  measurementId: "G-8RYP5L2D6P"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestFcmToken = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission not granted');
        return null;
      }
  
      // Register service worker
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker registered successfully', registration);
  
      // Request the FCM token
      const token = await getToken(messaging, {
        vapidKey: 'BKGT4LvlZ6wiOx6m_zXzvZieShQo5Bh0ZEPF5YqUQJc2IsDnzfG68cqCdifs4r7iLvmmrV_rQeogni2Hr9Yhxc4',
        serviceWorkerRegistration: registration
      });
  
      if (token) {
        console.log('FCM Token:', token);
        return token;
      } else {
        console.warn('No FCM token found');
        return null;
      }
    } catch (error) {
      console.error('FCM Token Error:', error);
      return null;
    }
  };