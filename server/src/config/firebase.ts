import admin from 'firebase-admin';
import { env } from './env';

if (!admin.apps.length) {
  const projectId = env.FIREBASE_PROJECT_ID || 'bihardarshan-26916';

  if (env.FIREBASE_PROJECT_ID && env.FIREBASE_PRIVATE_KEY && env.FIREBASE_CLIENT_EMAIL) {
    try {
      let privateKey = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
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
      console.log('✅ Firebase Admin initialized with service account cert');
    } catch (error) {
      console.warn('⚠️ Failed to initialize Firebase cert from env. Falling back to project ID init:', error);
      admin.initializeApp({ projectId });
    }
  } else {
    console.warn('⚠️ Firebase configuration is missing or incomplete. Initializing with project ID for token verification.');
    admin.initializeApp({ projectId });
  }
}

export const firebaseAdmin = admin;
