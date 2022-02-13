import React, { useEffect, useState } from 'react';
import db from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import './styles.css';

const Dashboard = () => {
  const [numberOfPatients, setNumberOfPatients] = useState(0);

  const findTotalNumberOfPatients = async () => {
    const collectRef = collection(db, 'Users');
    onSnapshot(collectRef, (snapshot) => {
      setNumberOfPatients(snapshot.docs.length);
    });
  };

  useEffect(() => {
    findTotalNumberOfPatients();
  }, []);

  return (
    <div className='dashboard'>
      <div>Total Number of patients : {numberOfPatients}</div>
    </div>
  );
};

export default Dashboard;
