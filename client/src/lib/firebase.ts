import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC4CVilXF6XVkXaCt39nILdR1D4xu9PMA0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bihardarshan-26916.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "bihardarshan-26916",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "bihardarshan-26916.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "500023080659",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:500023080659:web:e8d1a8dfe8449ce0144626",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-1KNXZ6PPCV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
