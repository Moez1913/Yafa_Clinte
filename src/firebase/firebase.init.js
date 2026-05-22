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
  apiKey: "AIzaSyCZbeduXRt2YqqBh4wrclGIyPNqalKslFU",
  authDomain: "korean-dewdrop-meem.firebaseapp.com",
  projectId: "korean-dewdrop-meem",
  storageBucket: "korean-dewdrop-meem.firebasestorage.app",
  messagingSenderId: "333511210682",
  appId: "1:333511210682:web:dd70d08ab90806b9bf7483",
  measurementId: "G-81LL7V4KQT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);

