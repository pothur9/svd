import { useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyAdXMi37-Rv-0hV6teopW2FMwoud9mjGaU",
  authDomain: "svdd-c3198.firebaseapp.com",
  projectId: "svdd-c3198",
  storageBucket: "svdd-c3198.firebasestorage.app",
  messagingSenderId: "849894574211",
  appId: "1:849894574211:web:2e8465d84311bdceb3b3b6",
  measurementId: "G-8RYP5L2D6P"
};

export const useFirebaseServiceWorker = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const registerServiceWorker = async () => {
        if ('serviceWorker' in navigator) {
          try {
            const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
            console.log('Service Worker registered successfully:', registration.scope);

            initializeApp(firebaseConfig);
            getMessaging();
          } catch (error) {
            console.error('Service Worker registration failed:', error);
          }
        } else {
          console.warn('Service Worker is not supported in this browser.');
        }
      };

      registerServiceWorker();
    }
  }, []);
};