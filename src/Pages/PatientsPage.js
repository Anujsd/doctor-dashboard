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
import { Avatar, Button, TextField } from '@mui/material';
import { collection, onSnapshot } from 'firebase/firestore';
import SinglePatient from './SinglePatient';
import { useNavigate } from 'react-router-dom';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const PatientsPage = () => {
  const navigate = useNavigate();
  const [persistentList, setPersistentList] = useState([]);
  const [patientsList, setPatientsList] = useState([]);
  const [singlePatient, setSinglePatient] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [oldSearchTerm, setOldSearchTerm] = useState('');
  const [directionOfSortAge, setDirectionOfSortAge] = useState(true);
  const [directionOfSortName, setDirectionOfSortName] = useState(true);

  const calculateAge = (birthDate) => {
    const dob = new Date(birthDate);
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
          rid: snap.id,
        };
      });
      setPatientsList(parray);
      setPersistentList(parray);
      // console.log(parray);
    });
  };

  const SortList = (sortColumn) => {
    if (sortColumn === 'name') {
      let fr, sr;
      if (directionOfSortName) {
        fr = -1;
        sr = 1;
      } else {
        fr = 1;
        sr = -1;
      }
      patientsList.sort(function (a, b) {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return fr;
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return sr;
        }
        return 0;
      });
      setDirectionOfSortName(!directionOfSortName);
    } else {
      let fr, sr;
      if (directionOfSortAge) {
        fr = -1;
        sr = 1;
      } else {
        fr = 1;
        sr = -1;
      }
      patientsList.sort(function (a, b) {
        if (a.age < b.age) {
          return fr;
        }
        if (a.age > b.age) {
          return sr;
        }
        return 0;
      });
      setDirectionOfSortAge(!directionOfSortAge);
    }
  };

  useEffect(() => {
    getAllPatients();
  }, []);

  useEffect(() => {
    let lst;
    if (oldSearchTerm.length > searchTerm.length) {
      lst = persistentList.filter((patient) => {
        const pstr = patient.name.toLowerCase();
        const pIdStr = patient.id.toLowerCase();
        if (
          pstr.includes(searchTerm.toLowerCase()) ||
          pIdStr.includes(searchTerm.toLowerCase())
        ) {
          return true;
        } else {
          return false;
        }
      });
    } else {
      lst = patientsList.filter((patient) => {
        const pstr = patient.name.toLowerCase();
        const pIdStr = patient.id.toLowerCase();
        if (
          pstr.includes(searchTerm.toLowerCase()) ||
          pIdStr.includes(searchTerm.toLowerCase())
        ) {
          return true;
        } else {
          return false;
        }
      });
    }
    setPatientsList(lst);
    setOldSearchTerm(searchTerm);
  }, [searchTerm]);

  return (
    <>
      <Box
        sx={{
          marginBottom: '15px',
        }}
      >
        <TextField
          id='outlined-search'
          label='Search patients'
          type='search'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      {singlePatient.length === 0 && (
        <Box sx={{ width: '100%', border: '1px solid black' }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow sx={{}}>
                  <TableCell>Media</TableCell>
                  <TableCell align='left'>Patients ID</TableCell>
                  <TableCell align='left'>
                    Name
                    <Button
                      sx={{
                        margin: '10px',
                      }}
                      onClick={() => SortList('name')}
                    >
                      {directionOfSortName ? (
                        <ArrowDownwardIcon />
                      ) : (
                        <ArrowUpwardIcon />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell align='left'>
                    Age
                    <Button
                      sx={{
                        margin: '10px',
                      }}
                      onClick={() => SortList('age')}
                    >
                      {directionOfSortAge ? (
                        <ArrowDownwardIcon />
                      ) : (
                        <ArrowUpwardIcon />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell align='left'>Contact No</TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ overflowY: 'auto' }}>
                {patientsList?.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': {
                        backgroundColor: '#add8e6',
                      },
                    }}
                    onClick={(e) => {
                      setSinglePatient(row);
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
      )}
      {singlePatient.length !== 0 && navigate(`/patients/${singlePatient.rid}`)}
    </>
  );
};

export default PatientsPage;
