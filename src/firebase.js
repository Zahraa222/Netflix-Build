import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDMFs_i60UUWNutBKJVzBkZ2U5W93JCnoM",
  authDomain: "netflix-clone-18cc6.firebaseapp.com",
  projectId: "netflix-clone-18cc6",
  storageBucket: "netflix-clone-18cc6.appspot.com",
  messagingSenderId: "1000960928424",
  appId: "1:1000960928424:web:e10790f27d2d1fa9b1f09d",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db =
  firebaseApp.firestore(); /*keeps track of what the user's subscription is */
const auth = firebase.auth();

export { auth };
export default db;
