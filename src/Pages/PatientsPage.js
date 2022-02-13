import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/system';
import db from '../firebase';
import React, { useEffect, useState } from 'react';
import { Avatar } from '@mui/material';
import { collection, onSnapshot } from 'firebase/firestore';

const PatientsPage = () => {
  const [patientsList, setPatientsList] = useState([]);
  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const calculateAge = (birthDate) => {
    const dob = new Date(birthDate);
    console.log(dob);
    //calculate month difference from current date in time
    var month_diff = Date.now() - dob.getTime();

    //convert the calculated difference in date format
    var age_dt = new Date(month_diff);

    //extract year from date
    var year = age_dt.getUTCFullYear();

    //now calculate the age of the user
    var age = Math.abs(year - 1970);
    return age;
  };

  const calculateId = (prop) => {
    console.log(prop.name);
  };

  const getAllPatients = () => {
    const collectRef = collection(db, 'Users');
    onSnapshot(collectRef, (snapshot) => {
      const parray = snapshot.docs.map((snap) => {
        const patient = snap.data();
        return {
          name: patient.patientName,
          gender: patient.gender,
          contact: patient.contactNumber,
          age: calculateAge(patient.birthDate),
          id:
            patient.patientName.slice(0, 1).toUpperCase() +
            patient.contactNumber.slice(0, 5),
        };
      });
      setPatientsList(parray);
      console.log(parray);
    });
  };

  useEffect(() => {
    getAllPatients();
  }, []);

  return (
    <Box sx={{ border: '1px solid blue' }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Media</TableCell>
              <TableCell align='left'>Patients ID</TableCell>
              <TableCell align='left'>Name</TableCell>
              <TableCell align='left'>Age</TableCell>
              <TableCell align='left'>Contact No</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patientsList?.map((row) => (
              <TableRow
                key={row.name}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': {
                    backgroundColor: '#add8e6',
                  },
                }}
              >
                <TableCell>
                  <Avatar> {row.name.slice(0, 1).toUpperCase()}</Avatar>
                </TableCell>
                <TableCell align='left'>{row.id}</TableCell>
                <TableCell align='left'>{row.name}</TableCell>
                <TableCell align='left'>{row.age}</TableCell>
                <TableCell align='left'>{row.contact}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PatientsPage;
