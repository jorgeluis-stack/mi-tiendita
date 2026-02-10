// src/lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // AQUÍ IRÁN TUS CLAVES DE FIREBASE MÁS ADELANTE
  // Por ahora déjalo así para que la app funcione con datos de prueba
  apiKey: "API_KEY_FALSA",
  authDomain: "prueba.firebaseapp.com",
  projectId: "prueba",
};

// Evita errores si se inicializa dos veces
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);