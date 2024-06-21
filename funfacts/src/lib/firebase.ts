import { initializeApp } from "firebase/app";

const config = {
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: "funfacts-d014a.firebaseapp.com",
  databaseURL: "https://funfacts-d014a-default-rtdb.firebaseio.com",
  projectId: "funfacts-d014a",
  storageBucket: "funfacts-d014a.appspot.com",
  messagingSenderId: "964003447131",
  appId: import.meta.env.FIREBASE_APP_ID,
  measurementId: "G-X3Z5VY72NF"
};

export const app = initializeApp(config);
