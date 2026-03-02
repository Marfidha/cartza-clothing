import { initializeApp } from "firebase/app";
import {getAuth ,GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBMPrVq12iJkaauPkiLYXe0a6oxBGb8kVg",
  authDomain: "ecommercewebapplication-dc71d.firebaseapp.com",
  projectId: "ecommercewebapplication-dc71d",
  storageBucket: "ecommercewebapplication-dc71d.firebasestorage.app",
  messagingSenderId: "193267284620",
  appId: "1:193267284620:web:78338762e49855ae1859a9",
  measurementId: "G-LWTJF17CVF"
};

const app = initializeApp(firebaseConfig);

export const Auth=getAuth(app)

export const googleProvider=new GoogleAuthProvider()