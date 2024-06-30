import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAnj8clJ6oJfReQLYU7LlK7ZF4fxiubvhc",
  authDomain: "experience-9062b.firebaseapp.com",
  projectId: "experience-9062b",
  storageBucket: "experience-9062b.appspot.com",
  messagingSenderId: "514143788543",
  appId: "1:514143788543:web:bfcba670f8ec1b19025bca",
  measurementId: "G-TXY42BLJYY",
};

const firebaseapp = initializeApp(firebaseConfig);
export const messaging = () => getMessaging(firebaseapp);

export default firebaseapp;
