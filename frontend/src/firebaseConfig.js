// src/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA2lsQK-EEdt5kEp7PI_NFgoFiJIcMlX-4",
  authDomain: "ayudasdemo.firebaseapp.com",
  projectId: "ayudasdemo",
  storageBucket: "ayudasdemo.appspot.com",
  messagingSenderId: "872228262829",
  appId: "1:872228262829:web:8683844cae863974404724",
  measurementId: "G-WBSSLM9KFW"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar módulos de Firebase
export const auth = getAuth(app); // Authentication
export const db = getFirestore(app); // Firestore
export const analytics = getAnalytics(app); // Analytics
