// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKFinkyjgys2HOO_QpRoMosGYyTFEcIgE",
  authDomain: "masterking-fa629.firebaseapp.com",
  projectId: "masterking-fa629",
  storageBucket: "masterking-fa629.firebasestorage.app",
  messagingSenderId: "680021576286",
  appId: "1:680021576286:web:52769441eeda5ab56f02cf",
  measurementId: "G-9443L8L88Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, analytics };