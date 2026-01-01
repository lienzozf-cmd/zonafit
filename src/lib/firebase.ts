// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAS-UxI74ectIsaBNppYtqZ56NPD0vVumw",
  authDomain: "zona-fit-gt1-81360479-f044e.firebaseapp.com",
  projectId: "zona-fit-gt1-81360479-f044e",
  storageBucket: "zona-fit-gt1-81360479-f044e.appspot.com",
  messagingSenderId: "31583621628",
  appId: "1:31583621628:web:1f0fd59437d08ce501e279",
  measurementId: "G-NEHLWVGY82"
};

// Initialize Firebase
let app: FirebaseApp;
let analytics: any;

function getFirebaseApp() {
    if (!getApps().length) {
        app = initializeApp(firebaseConfig);
        if (typeof window !== 'undefined') {
            isSupported().then(supported => {
                if (supported) {
                    analytics = getAnalytics(app);
                }
            });
        }
    } else {
        app = getApp();
    }
    return app;
}


export { getFirebaseApp, analytics };
