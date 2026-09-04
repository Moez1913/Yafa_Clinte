// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCFCQ-IttYXyDcO6Aqcp2_ndePXP-oxlBw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "yafaa-41766.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "yafaa-41766",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "yafaa-41766.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "151261187733",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:151261187733:web:761949e6a7ea9f092b959c",
  
};

const requiredFirebaseConfigKeys = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"];
const missingFirebaseConfigKeys = requiredFirebaseConfigKeys.filter(
  (key) => !firebaseConfig[key]
);

if (missingFirebaseConfigKeys.length > 0) {
  throw new Error(
    `Missing Firebase configuration values: ${missingFirebaseConfigKeys.join(", ")}`
  );
}



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export const auth = getAuth(app);
export const db = getFirestore(app);
export { analytics };

