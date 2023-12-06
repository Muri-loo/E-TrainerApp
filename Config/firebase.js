// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyCrVdu64RXkt38rt646rPrhfB5cneS_k8M",
  authDomain: "e-trainerapp-5d441.firebaseapp.com",
  projectId: "e-trainerapp-5d441",
  storageBucket: "e-trainerapp-5d441.appspot.com",
  messagingSenderId: "819907573721",
  appId: "1:819907573721:web:e25ad3d6dddcb268a54bc8",
  measurementId: "G-BF1KYNGNZG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
//const auth = getAuth(app);
console.log("app");
export const db = getFirestore(app);


export  {auth}; 



