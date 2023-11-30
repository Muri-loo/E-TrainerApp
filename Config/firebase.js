// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCc44PeKZTEmXUQnodouU2PPM71Wj3Gdi8",
  authDomain: "e-trainerapp.firebaseapp.com",
  projectId: "e-trainerapp",
  storageBucket: "e-trainerapp.appspot.com",
  messagingSenderId: "923767889703",
  appId: "1:923767889703:web:d279846216ebfd8e5cd302",
  measurementId: "G-Q00RCCXLX0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
console.log("app");
const analytics = getAnalytics(app);

export  {auth}; 
