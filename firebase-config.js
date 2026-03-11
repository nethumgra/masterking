// ============================================================
// firebase-config.js  –  SINGLE SOURCE OF TRUTH
// All pages import { db, auth } from this file.
// No more duplicate configs scattered everywhere!
// ============================================================
import { initializeApp }  from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore }   from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey:            "AIzaSyDKFinkyjgys2HOO_QpRoMosGYyTFEcIgE",
    authDomain:        "masterking-fa629.firebaseapp.com",
    projectId:         "masterking-fa629",
    storageBucket:     "masterking-fa629.firebasestorage.app",
    messagingSenderId: "680021576286",
    appId:             "1:680021576286:web:52769441eeda5ab56f02cf",
    measurementId:     "G-9443L8L88Q"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// ✅ Session persist — page වෙනස් වුනත්, browser close කරත් logged in ම තිරෙනවා
setPersistence(auth, browserLocalPersistence).catch(console.error);

// Path helpers
const _appId         = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const PUBLIC_PATH    = `/artifacts/${_appId}/public/data`;
const USERS_PATH     = `/users`;

// XSS sanitizer – use this before any innerHTML injection
function sanitize(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;')
        .replace(/>/g,'&gt;').replace(/"/g,'&quot;')
        .replace(/'/g,'&#x27;');
}

export { app, auth, db, PUBLIC_PATH, USERS_PATH, sanitize };