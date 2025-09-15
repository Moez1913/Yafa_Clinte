// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDM4S0MihAiLORI7itlw4oPY56NQcbjmx0",
  authDomain: "korean-dewdrop.firebaseapp.com",
  projectId: "korean-dewdrop",
  storageBucket: "korean-dewdrop.firebasestorage.app",
  messagingSenderId: "640689045181",
  appId: "1:640689045181:web:cabdb6b3146a6454e581d4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)