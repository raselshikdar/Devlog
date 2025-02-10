import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase Client-Side SDK configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIRE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIRE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIRE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIRE_SB,
  messagingSenderId: process.env.NEXT_PUBLIC_FIRE_MESSAGE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIRE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIRE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

// Firebase Client SDK exports
export const auth = getAuth();
export const googleAuthProvider = new GoogleAuthProvider();
export const githubAuthProvider = new GithubAuthProvider();
export const facebookAuthProvider = new FacebookAuthProvider();

// Firestore and Storage exports
export const db = getFirestore(app);
export const storage = getStorage(app);

// Firebase Admin SDK - server-side logic (using the correct environment variables)
import admin from 'firebase-admin';

const adminConfig = {
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),  // handle line breaks in private key
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
};

if (!admin.apps.length) {
  admin.initializeApp(adminConfig);
} else {
  admin.app(); // if already initialized
}

// Admin SDK exports (only used server-side)
export const adminDb = admin.firestore();
export const adminAuth = admin.auth();

// Helper functions
export async function getUserWithUsername(username) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username), limit(1));
  let userDoc = (await getDocs(q)).docs[0];
  return userDoc;
}

export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  };
}
