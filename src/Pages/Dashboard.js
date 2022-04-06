import React, { useEffect, useState } from 'react';
import db from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import './styles.css';
import { Box, Card, CardContent, Paper, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import UpcomingAppointments from '../components/UpcomingAppointments';
import { getAppointmentsData } from '../firebase';
import Chart from 'chart.js/auto';

const Dashboard = () => {
  const [appointmentList, setAppointmentList] = useState([]);
  const [upcomingAppointmentList, setUpcomingAppointmentList] = useState([]);
  const [monthArray, setMonthArray] = useState([1, 2, 0, 2, 1]);
  const [numberOfPatients, setNumberOfPatients] = useState(0);

  useEffect(async () => {
    const currentDate = new Date('jan 1 2022');
    const MonthData = Array(5).fill(0);
    const alist = await getAppointmentsData();
    setAppointmentList(alist);
    const ans = alist.filter((a) => {
      const atime = new Date(a.time);
      if (atime.getMonth() < 5) MonthData[atime.getMonth()] += 1;
      if (atime >= currentDate) return true;
    });
    setUpcomingAppointmentList(ans);
    setMonthArray([...MonthData]);
    // console.log(alist);
    // console.log(MonthData);
  }, []);

  const findTotalNumberOfPatients = async () => {
    const collectRef = collection(db, 'Users');
    onSnapshot(collectRef, (snapshot) => {
      setNumberOfPatients(snapshot.docs.length);
    });
  };

  useEffect(() => {
    findTotalNumberOfPatients();
  }, []);

  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Appointments',
        fill: false,
        lineTension: 0.5,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: monthArray,
      },
    ],
  };

  return (
    <Box className='dashboard' sx={{ display: 'flex', flexDirection: 'row' }}>
      <Box sx={{ width: '70%' }}>
        <Box
          sx={{
            margin: 1,
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
          }}
        >
          <Card
            sx={{
              border: '1px solid black',
              width: '45%',
              maxHeight: 150,
              margin: 2,
              '&:hover': {},
            }}
          >
            <CardContent>
              <Typography sx={{ fontSize: 14, color: '#808080' }} gutterBottom>
                Total Number of patients
              </Typography>
              <Typography sx={{ fontSize: 40 }}>{numberOfPatients}</Typography>
            </CardContent>
          </Card>
          <Card
            sx={{
              border: '1px solid black',
              width: '45%',
              maxHeight: 150,
              margin: 2,
              '&:hover': {},
            }}
          >
            <CardContent>
              <Typography sx={{ fontSize: 14, color: '#808080' }} gutterBottom>
                Total upcoming Appointments
              </Typography>
              <Typography sx={{ fontSize: 40 }}>
                {upcomingAppointmentList.length}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box
          sx={{
            margin: 2,
            width: '95%',
            padding: '30px',
            border: '1px solid black',
          }}
          component={Paper}
        >
          <Line
            data={chartData}
            options={{
              title: {
                display: true,
                text: 'Average Appointments per month',
                fontSize: 20,
              },
              legend: {
                display: true,
                position: 'right',
              },
            }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          margin: 2,
          backgroundColor: '#E8E8E8',
          width: '30%',
        }}
      >
        <UpcomingAppointments appointmentList={upcomingAppointmentList} />
      </Box>
    </Box>
  );
};

export default Dashboard;
