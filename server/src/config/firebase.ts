import admin from 'firebase-admin';
import { env } from './env';

if (!admin.apps.length) {
  const projectId = env.FIREBASE_PROJECT_ID || 'bihardarshan-26916';

  if (
    env.FIREBASE_PROJECT_ID &&
    env.FIREBASE_PRIVATE_KEY &&
    env.FIREBASE_CLIENT_EMAIL
  ) {
    let privateKey = env.FIREBASE_PRIVATE_KEY;

    // Convert literal \n into real newlines
    privateKey = privateKey.replace(/\\n/g, '\n');

    // Remove accidental surrounding quotes
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });

    console.log('✅ Firebase Admin initialized successfully');
  } else {
    console.warn(
      '⚠️ Missing Firebase Admin environment variables (FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL). Firebase authentication will not work until set.'
    );
  }
}

export const firebaseAdmin = admin;