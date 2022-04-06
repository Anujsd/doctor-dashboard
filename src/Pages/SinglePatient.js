import {
  Avatar,
  Box,
  Button,
  Link,
  List,
  ListItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import Tab from '@mui/material/Tab';
import {
  addDoc,
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import db, { upload, useAuth } from '../firebase';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import Chat from '../components/Chat';

//For tabs taken from material ui page
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

//age calculation function
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

//For generating random color taken from material ui Avatar page
function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const SinglePatient = () => {
  let { id: prid } = useParams();
  const navigate = useNavigate();
  //For handling tabs
  const [value, setValue] = useState(0);
  const [patient, setPatient] = useState('');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);

  //handling file uploads
  const [fileToUpload, setFileToUpload] = useState(null);
  const [filesDescription, setFilesDescription] = useState('');
  const currentUser = useAuth();
  const selectBtn = useRef();
  const descriptionTextArea = useRef();

  useEffect(() => {
    getPatientInfo();
  }, []);

  const getPatientInfo = async () => {
    const docRef = doc(db, 'Users', prid);
    const querySnapshot = await getDoc(docRef);
    console.log(querySnapshot.data());
    setPatient(querySnapshot.data());
  };

  const getRecordsData = async () => {
    const docRef = doc(db, 'Users', prid);
    const recordsList = [];
    const querySnapshot = await getDocs(collection(docRef, 'record_files'));
    querySnapshot.forEach((doc) => {
      recordsList.push({
        id: doc.id,
        date: doc.data().date,
        url: doc.data().url,
        description: doc.data().description,
      });
      // console.log(doc.id, ' => ', doc.data());
    });
    function custom_sort(a, b) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    recordsList.sort(custom_sort);
    console.log(recordsList);
    setRecords(recordsList);
  };

  const getAppointmentData = async () => {
    const docRef = doc(db, 'Users', prid);

    const appointmentsList = [];
    const querySnapshotAppointment = await getDocs(
      collection(docRef, 'Appointments')
    );
    querySnapshotAppointment.forEach((doc) => {
      appointmentsList.push({
        id: doc.id,
        time: doc.data().appointmentTime,
        note: doc.data().descriptiveNote,
      });
      // console.log(doc.id, ' => ', doc.data());
    });

    function custom_sort(a, b) {
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    }
    appointmentsList.sort(custom_sort);
    console.log(appointmentsList);
    setAppointments(appointmentsList);
  };

  useEffect(() => {
    console.log(patient);
    getAppointmentData();
    getRecordsData();
  }, []);

  const handleSelect = (e) => {
    e.preventDefault();
    setFileToUpload(e.target.files[0]);
    selectBtn.current.textContent = e.target.files[0].name.slice(0, 10);
    console.log(e.target.files[0]);
  };

  const handleUpload = async () => {
    const photoUrl = await upload(fileToUpload, currentUser);

    //add entry in records database
    const docRef = doc(db, 'Users', prid);
    const fileRef = await addDoc(collection(docRef, 'record_files'), {
      date: new Date().toDateString(),
      description: filesDescription,
      url: photoUrl,
    });

    console.log(photoUrl);
    getRecordsData();
    selectBtn.current.textContent = 'select file';
    descriptionTextArea.current.children[1].children[0].value = '';
  };

  const handleDescription = (e) => {
    setFilesDescription(e.target.value);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box>
        <Button onClick={() => navigate('/patients')}>Back</Button>
      </Box>
      {patient && (
        <div>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              border: '1px solid red',
              padding: '10px',
            }}
          >
            <Box>
              <Avatar
                variant='square'
                sx={{
                  width: '150px',
                  height: '200px',
                  bgcolor: stringToColor(patient?.patientName),
                }}
              >
                {patient?.patientName.slice(0, 1).toUpperCase()}
              </Avatar>
            </Box>
            <Box>
              <List>
                <ListItem>Name : {patient?.patientName}</ListItem>
                <ListItem>Age : {calculateAge(patient?.birthDate)}</ListItem>
                <ListItem>Gender : {patient?.gender}</ListItem>
                <ListItem>Contact : {patient?.contactNumber}</ListItem>
              </List>
            </Box>
          </Box>
          <Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label='basic tabs example'
              >
                <Tab label='Appointments' {...a11yProps(0)} />
                <Tab label='Records' {...a11yProps(1)} />
                <Tab label='Chat' {...a11yProps(2)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                  <TableHead>
                    <TableRow>
                      <TableCell align='left'>Time</TableCell>
                      <TableCell align='left'>Note</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointments?.map((row) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                          '&:hover': {
                            backgroundColor: '#add8e6',
                          },
                        }}
                      >
                        <TableCell align='left'>{row.time}</TableCell>
                        <TableCell align='left'>{row.note}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: '20px',
                }}
              >
                <Button
                  variant='contained'
                  component='label'
                  onChange={handleSelect}
                  sx={{ backgroundColor: 'red', marginRight: '10px' }}
                  ref={selectBtn}
                >
                  Select File
                  <input type='file' hidden />
                </Button>
                <TextField
                  id='outlined-basic'
                  label='Description'
                  variant='outlined'
                  onChange={handleDescription}
                  ref={descriptionTextArea}
                  sx={{ width: '50vw' }}
                />
                <Button
                  variant='contained'
                  component='label'
                  onClick={handleUpload}
                  sx={{ marginLeft: '10px' }}
                >
                  upload File
                </Button>
              </Box>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                  <TableHead>
                    <TableRow>
                      <TableCell>SrNO</TableCell>
                      <TableCell align='left'>Description</TableCell>
                      <TableCell align='left'>Date</TableCell>
                      <TableCell align='left'>Files</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {records?.map((row, i) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                          '&:hover': {
                            backgroundColor: '#add8e6',
                          },
                        }}
                      >
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell align='left'>{row.date}</TableCell>
                        <TableCell align='left'>
                          <a href={row.url} target='_blank'>
                            Open
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Chat id={prid} />
            </TabPanel>
          </Box>
        </div>
      )}
    </Box>
  );
};

export default SinglePatient;
