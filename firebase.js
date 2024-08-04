// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYqjfgK0U0go2IU13AJLvHbO_PPkKeT00",
  authDomain: "inventory-management-a66c1.firebaseapp.com",
  projectId: "inventory-management-a66c1",
  storageBucket: "inventory-management-a66c1.appspot.com",
  messagingSenderId: "92751672250",
  appId: "1:92751672250:web:af280b73c5bd4c76d92383",
  measurementId: "G-1FJRKT9KR2"
  
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
const storage = getStorage(app);

export {firestore, storage}