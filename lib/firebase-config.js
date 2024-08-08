// lib/firebase-config.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAc6PYgYY9aG6En7thLMpo8OgerTPoBqw8",
  authDomain: "test-d87aa.firebaseapp.com",
  projectId: "test-d87aa",
  storageBucket: "test-d87aa.appspot.com",
  messagingSenderId: "569014450533",
  appId: "1:569014450533:web:db7ad514df79c6f40a098c",
  measurementId: "G-D17SZ4W14X",
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, db, storage };
