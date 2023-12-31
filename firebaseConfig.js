import { initializeApp } from 'firebase/app';
import { environment } from './environments/environment';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { connectStorageEmulator } from 'firebase/storage';
import { connectFunctionsEmulator } from 'firebase/functions';


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
const app = initializeApp(environment.firebase);
const firestore = getFirestore(app);
if (environment.useEmulators) {
  connectFirestoreEmulator(firestore, environment.emulatorConfig.firestore.host, environment.emulatorConfig.firestore.port);
}

// Read collection from Firestore and print it
const querySnapshot = getDocs(collection(firestore, "MiViaje"));

export {
  firestore
}