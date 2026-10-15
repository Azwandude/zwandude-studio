// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, connectStorageEmulator  } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABDyUpoUOeguKYO29af_Co_HFA_kRLZAk",
  authDomain: "zwandude-studio.firebaseapp.com",
  projectId: "zwandude-studio",
  storageBucket: "zwandude-studio.firebasestorage.app",
  messagingSenderId: "354256161163",
  appId: "1:354256161163:web:0c2763e0a76ad29442078e",
  measurementId: "G-5SK7WEWMSY"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics only runs in the browser; importing this module during SSR is safe.
export const analytics = typeof window === "undefined" ? null : getAnalytics(app);

// ...

storage.maxUploadRetryTime = 15000;
storage.maxOperationRetryTime = 15000;