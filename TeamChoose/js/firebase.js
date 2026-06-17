import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDCiNs4lmFml1o2uo74hmmpgHZhD14Wgw4",
  authDomain: "teamder-70b63.firebaseapp.com",
  projectId: "teamder-70b63",
  storageBucket: "teamder-70b63.firebasestorage.app",
  messagingSenderId: "471685267710",
  appId: "1:471685267710:web:dcdc4a8fcb56c15b2725af",
  measurementId: "G-HFKNX5BQQ8",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
