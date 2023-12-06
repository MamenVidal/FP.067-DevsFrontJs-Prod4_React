import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
import { 
  Firestore,
  collectionData,
  collection,
  query,
  orderBy,
  deleteDoc,
  getFirestore,
  doc,
  where,
  getDocs,
  addDoc,
  setDoc,
  DocumentReference,
} from 'firebase/firestore';
// import {...} from "firebase/functions";
import { getStorage, provideStorage } from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAVUxS20D4ilBqqK94VPNBjKjxC0UUms1I",
  authDomain: "misviajes-d61aa.firebaseapp.com",
  databaseURL: 'https://misviajes-d61aa.firebaseapp.com',
  projectId: "misviajes-d61aa",
  storageBucket: "misviajes-d61aa.appspot.com",
  messagingSenderId: "398595674992",
  appId: "1:398595674992:web:1b573fde23396d497735b5",
  measurementId: "G-YZZECZZEPY",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const firestore = getFirestore(app);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

// Read collection from Firestore and print it
const querySnapshot = getDocs(collection(db, "MiViaje"));
console.log(querySnapshot);

export {
  db
}