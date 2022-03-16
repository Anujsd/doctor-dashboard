import React, { useEffect, useState } from 'react';
import db from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import './styles.css';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { Chart } from 'react-chartjs-2';

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
      data: [65, 59, 80, 81, 70],
    },
  ],
};

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
    <Box className='dashboard' sx={{ display: 'flex', flexDirection: 'row' }}>
      <Box sx={{ margin: 1 }}>
        <Card
          sx={{
            maxWidth: 150,
            maxHeight: 150,
            margin: 1,
          }}
        >
          <CardContent>
            <Typography sx={{ fontSize: 14 }} gutterBottom>
              Appointments Today
            </Typography>
            <Typography sx={{ fontSize: 40 }}>{0}</Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            maxWidth: 150,
            maxHeight: 150,
            margin: 1,
          }}
        >
          <CardContent>
            <Typography sx={{ fontSize: 14 }} gutterBottom>
              Appointments This week
            </Typography>
            <Typography sx={{ fontSize: 40 }}>{0}</Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            maxWidth: 150,
            maxHeight: 150,
            margin: 1,
          }}
        >
          <CardContent>
            <Typography sx={{ fontSize: 14 }} gutterBottom>
              Total Number of patients
            </Typography>
            <Typography sx={{ fontSize: 40 }}>{numberOfPatients}</Typography>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ margin: 2, width: '50%' }}>
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
      <Box sx={{ margin: 2, backgroundColor: 'gray', width: '30%' }}>
        Upcoming appointments
      </Box>
    </Box>
  );
};

export default Dashboard;
