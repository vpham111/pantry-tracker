// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth"; // Import Firebase Auth

// Your web app's Firebase configuration
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
const firestore = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app); // Initialize Firebase Auth

export { firestore, storage, auth };
