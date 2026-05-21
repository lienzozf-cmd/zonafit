// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
// import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "zona-fit-gt1-81360479-f044e.firebaseapp.com",
  projectId: "zona-fit-gt1-81360479-f044e",
  storageBucket: "zona-fit-gt1-81360479-f044e.appspot.com",
  messagingSenderId: "31583621628",
  appId: "1:31583621628:web:1f0fd59437d08ce501e279",
  measurementId: "G-NEHLWVGY82"
};

import { getAuth, type Auth } from "firebase/auth";

// Initialize Firebase
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

function getFirebaseApp() {
    if (!getApps().length) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApp();
    }
    return app;
}

function getFirestoreDB() {
    if (!db) {
        db = getFirestore(getFirebaseApp());
    }
    return db;
}

function getFirebaseAuth() {
    if (!auth) {
        auth = getAuth(getFirebaseApp());
    }
    return auth;
}

export { getFirebaseApp, getFirestoreDB, getFirebaseAuth };
