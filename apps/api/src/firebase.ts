import * as admin from 'firebase-admin';

export function ensureFirebaseInitialized(): void {
  if (admin.apps.length > 0) return;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!projectId || !privateKey || !clientEmail) {
    throw new Error(
      'Firebase credentials missing. Set FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL.',
    );
  }

  admin.initializeApp({
    credential: admin.credential.cert({ projectId, privateKey, clientEmail }),
  });
}

export default admin;
