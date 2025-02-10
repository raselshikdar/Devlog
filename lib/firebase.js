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
import admin from 'firebase-admin'; // Import Firebase Admin SDK

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

// Initialize Firebase Admin SDK if the credentials are provided
if (!admin.apps.length) {
  const credentials = process.env.FIREBASE_ADMIN_CREDENTIALS
    ? JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS)
    : null;

  if (credentials) {
    admin.initializeApp({
      credential: admin.credential.cert(credentials),
      databaseURL: `https://${process.env.NEXT_PUBLIC_FIRE_PROJECT_ID}.firebaseio.com`, // Make sure to replace with your actual Firebase Database URL if required
    });
  } else {
    console.error("Firebase Admin credentials not found in environment variables.");
  }
} else {
  admin.app(); // If already initialized, use the existing instance
}

// Auth exports
export const auth = getAuth();
export const googleAuthProvider = new GoogleAuthProvider();
export const githubAuthProvider = new GithubAuthProvider();
export const facebookAuthProvider = new FacebookAuthProvider();

// Firestore exports
export const db = getFirestore(app);

// Storage exports
export const storage = getStorage(app);

/// Helper functions
/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username), limit(1));
  let userDoc = (await getDocs(q)).docs[0];
  return userDoc;
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  };
}
