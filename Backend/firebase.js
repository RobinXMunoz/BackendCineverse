// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwzANMiNODchXML3J_yZuYE5I8CV1m_kU",
  authDomain: "basecineverse.firebaseapp.com",
  projectId: "basecineverse",
  storageBucket: "basecineverse.firebasestorage.app",
  messagingSenderId: "1023052502640",
  appId: "1:1023052502640:web:f003dc323256f7672986b5"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);