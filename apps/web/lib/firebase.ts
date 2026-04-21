// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXWywLOK89FSGSZ4SNHK1G_t8tgVmHv8U",
  authDomain: "eghealthcare-b1daa.firebaseapp.com",
  projectId: "eghealthcare-b1daa",
  storageBucket: "eghealthcare-b1daa.firebasestorage.app",
  messagingSenderId: "318363221520",
  appId: "1:318363221520:web:4578926fd9aaf143655495",
  measurementId: "G-6F9CS7XZJB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app)

// Set persistence to session (clears on tab close)
setPersistence(auth, browserSessionPersistence).catch(error => {
  console.error('Error setting persistence:', error)
})

export default app
