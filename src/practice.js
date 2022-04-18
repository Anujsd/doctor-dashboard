import { initializeApp } from 'firebase/app';
import {
  doc,
  getFirestore,
  onSnapshot,
  collection,
  getDocs,
  setDoc,
  addDoc,
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

export async function getAppointmentsData() {
  const appointmentsData = [];
  const usersDocs = await getDocs(collection(getFirestore(), 'Users'));
  const userIds = usersDocs.docs.map((user) => user.id);
  for (const user of userIds) {
    const docRef = doc(getFirestore(), 'Users', user);

    const appointmentDoc = await getDocs(collection(docRef, 'Appointments'));
    for (const apt of appointmentDoc.docs) {
      appointmentsData.push({
        time: apt.data().appointmentTime,
        uid: user,
        note: apt.data().descriptiveNote,
        name: apt.data().patientName,
        apid: apt.id,
      });
    }
  }
  return appointmentsData;
}

const data = await getAppointmentsData();

async function insertInAppointments() {
  for (const d of data) {
    const docRef = await addDoc(collection(getFirestore(), 'Appointments'), d);
  }
}
insertInAppointments();
console.log('inserted all');
