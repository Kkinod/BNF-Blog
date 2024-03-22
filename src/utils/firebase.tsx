// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: process.env.FIREBASE,
	authDomain: "blog-1234567.firebaseapp.com",
	projectId: "blog-1234567",
	storageBucket: "blog-1234567.appspot.com",
	messagingSenderId: "967727989597",
	appId: "1:967727989597:web:026ab71d8005b0863f1eb4",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
