// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvF5reoX4g2QkCGCdzj9dkCaV2ySEhSPI",
  authDomain: "bockbrowserauth.firebaseapp.com",
  projectId: "bockbrowserauth",
  storageBucket: "bockbrowserauth.firebasestorage.app",
  messagingSenderId: "1011597616469",
  appId: "1:1011597616469:web:774f0658b7b23bce493bdc",
  measurementId: "G-CL53BT0LNT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);