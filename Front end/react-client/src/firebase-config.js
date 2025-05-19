// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBLhrN2vZqhU5xrPXN7iMqHcdQIa0af6_4",
  authDomain: "chatfeature-7110c.firebaseapp.com",
  projectId: "chatfeature-7110c",
  storageBucket: "chatfeature-7110c.firebasestorage.app",
  messagingSenderId: "200310536236",
  appId: "1:200310536236:web:d358707af72a7294edf989",
  measurementId: "G-2FPKQWC5KY"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const messaging = getMessaging(app);