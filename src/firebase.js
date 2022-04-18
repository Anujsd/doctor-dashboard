import { initializeApp } from 'firebase/app';
import {
  doc,
  getFirestore,
  onSnapshot,
  collection,
  getDocs,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

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

//for uploading files to firebase storage
const storage = getStorage();

export async function upload(file, currentUser) {
  const fileRef = ref(storage, file.name);
  // setLoading(true);
  const snapshot = await uploadBytes(fileRef, file);
  const photoURL = await getDownloadURL(fileRef);
  // setLoading(false);
  alert('file is uploaded');
  return photoURL;
}

export async function getAppointmentsData() {
  const appointmentsData = [];
  const usersDocs = await getDocs(collection(getFirestore(), 'Appointments'));
  usersDocs.docs.map((user) =>
    appointmentsData.push({ ...user.data(), id: user.id })
  );
  return appointmentsData;
}
