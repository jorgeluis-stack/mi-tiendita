// src/lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyApedVemC81SlB3hkkWxVvgLcxaveTeDCk",
  authDomain: "supersmartapp.firebaseapp.com",
  projectId: "supersmartapp",
  storageBucket: "supersmartapp.firebasestorage.app",
  messagingSenderId: "426643109568",
  appId: "1:426643109568:web:26e4016f7e76115a735f25"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);