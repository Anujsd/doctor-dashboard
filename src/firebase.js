import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from 'firebase/auth';

import { useEffect, useState } from 'react';

const firebaseConfig = {
  apiKey: 'AIzaSyDFr5EIa_JFeBYzgPtOCmNBzuunFeLBq-s',
  authDomain: 'health-app-bcec3.firebaseapp.com',
  projectId: 'health-app-bcec3',
  storageBucket: 'health-app-bcec3.appspot.com',
  messagingSenderId: '835536691110',
  appId: '1:835536691110:web:eb5bda4cf5a3e4a0ddf967',
};

const app = initializeApp(firebaseConfig);

// For authentication
const auth = getAuth();

export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}

// Custom Hook for getting current user which is logged in
export function useAuth() {
  const [currentUser, setCurrentUser] = useState();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return unsub;
  }, []);
  return currentUser;
}

// For firestore database
export default getFirestore();
