import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAgdpL0y_drLeILH50YMtrcOThdLwbfDAk",
  authDomain: "shopreact-7db24.firebaseapp.com",
  projectId: "shopreact-7db24",
  storageBucket: "shopreact-7db24.firebasestorage.app",
  messagingSenderId: "146578688896",
  appId: "1:146578688896:web:821f5654ae401f8532cf65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services to use across the app
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;