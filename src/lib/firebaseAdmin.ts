import admin from 'firebase-admin';
import serviceAccount from '../config/serviceAccountKey.json'; // Adjust path based on your structure

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export default admin;
