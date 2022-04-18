import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { getAppointmentsData } from '../firebase';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import './styles.css';
import { Button } from '@mui/material';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import db from '../firebase';

const columns = [
  { field: 'time', headerName: 'Date and Time', width: 200, sortable: true },
  { field: 'name', headerName: 'Patients name', width: 130 },
  { field: 'note', headerName: 'Note', width: 130 },
];

function custom_sort(a, b) {
  return new Date(b.time).getTime() - new Date(a.time).getTime();
}

const Appointment = () => {
  const [appointmentList, setAppointmentList] = useState([]);

  const [count, setCount] = useState(0);

  const handleDelete = async ({ uid, apid, id }) => {
    const docRef = doc(db, 'Users', uid);
    await deleteDoc(doc(docRef, 'Appointments', apid));
    await deleteDoc(doc(db, 'Appointments', id));
    setCount(count + 1);
  };

  useEffect(async () => {
    const currentDate = new Date('jan 1 2022');
    const alist = await getAppointmentsData();
    const ans = alist.filter((a) => {
      const atime = new Date(a.time);
      if (atime >= currentDate) return true;
    });
    ans.sort(custom_sort);
    setAppointmentList(ans);
    console.log(ans);
  }, [count]);

  return (
    <>
      <h3>Upcoming Appointments</h3>
      <Box className='appointment-table'>
        <Box className='data-row' sx={{ fontWeight: '700' }}>
          <p className='data-row-time data-row-item'>Time</p>
          <p className='data-row-name data-row-item'>Patients Name</p>
          <p className='data-row-note data-row-item'>Note</p>
        </Box>
        {appointmentList.map((data) => {
          return (
            <Box className='data-row' key={data.apid}>
              <p className='data-row-time data-row-item'>{data.time}</p>
              <p className='data-row-name data-row-item'> {data.name}</p>
              <p className='data-row-note data-row-item'> {data.note}</p>
              <Button
                onClick={() =>
                  handleDelete({ uid: data.uid, apid: data.apid, id: data.id })
                }
              >
                Delete
              </Button>
            </Box>
          );
        })}
      </Box>
    </>
  );
};

export default Appointment;
