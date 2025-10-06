import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import { getAuth } from 'firebase/auth';

// Temporarily disable Firebase Auth - generate custom UIDs instead
export const generateCustomUID = () => {
  return `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAdXMi37-Rv-0hV6teopW2FMwoud9mjGaU",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "svdd-c3198.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "svdd-c3198",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "svdd-c3198.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "849894574211",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:849894574211:web:2e8465d84311bdceb3b3b6",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-8RYP5L2D6P"
};

const app = initializeApp(firebaseConfig);

// Only initialize messaging in the browser
let messaging: ReturnType<typeof getMessaging> | null = null;
if (typeof window !== 'undefined') {
  messaging = getMessaging(app);
}

// Export auth but it won't be used for authentication
export const auth = getAuth(app);

export const requestFcmToken = async () => {
    try {
      // Ensure we're in a browser environment
      if (typeof window === 'undefined' || !messaging) {
        console.warn('FCM not available in this environment');
        return null;
      }

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return null;
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker registered successfully', registration);

      // Request the FCM token
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || 'BKGT4LvlZ6wiOx6m_zXzvZieShQo5Bh0ZEPF5YqUQJc2IsDnzfG68cqCdifs4r7iLvmmrV_rQeogni2Hr9Yhxc4',
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