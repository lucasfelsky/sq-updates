// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  // <-- SUBSTITUA por suas credenciais do Firebase Web App
  apiKey: "AIzaSyAZz23jIx_p8RVioxd3LmsXHPhsOjr0t5w",
  authDomain: "sq-comex-updates.firebaseapp.com",
  projectId: "sq-comex-updates",
  storageBucket: "sq-comex-updates.firebasestorage.app",
  messagingSenderId: "777780048398",
  appId: "1:777780048398:web:76b2d83ed8bc4afd04425f",
  measurementId: "G-Q57TX1SHPV"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
