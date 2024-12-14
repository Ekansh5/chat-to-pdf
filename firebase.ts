// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxvCekDMQo0nhzejbazqNexwS4N59BJBQ",
  authDomain: "chat-with-pdf-saas-8501a.firebaseapp.com",
  projectId: "chat-with-pdf-saas-8501a",
  storageBucket: "chat-with-pdf-saas-8501a.appspot.com",
  messagingSenderId: "1000049301728",
  appId: "1:1000049301728:web:613d964425dd86a85dd885"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app)
const storage = getStorage(app)

export { db, storage };