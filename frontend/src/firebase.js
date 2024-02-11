// this file was provided by the Firebase Setup Docs at https://firebase.google.com/docs/web/setup

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1tJLgcwZAM-CpQycH9GF-3X50nJ0pSb8",
  authDomain: "officehoursproject-e6c61.firebaseapp.com",
  projectId: "officehoursproject-e6c61",
  storageBucket: "officehoursproject-e6c61.appspot.com",
  messagingSenderId: "499685175743",
  appId: "1:499685175743:web:ded7be3089a7b0bdc7b10a",
  measurementId: "G-SH0M4P2BFG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("App initialized")
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export default app