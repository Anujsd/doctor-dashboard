import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';

import './UpcomingAppointments.css';

const UpcomingAppointments = ({ appointmentList }) => {
  return (
    <>
      <Box className='grid-name'>Upcoming Appointments</Box>
      <Box className='whole-grid'>
        {appointmentList.map((data, i) => {
          return (
            <Box className='grid-item' key={i}>
              <p className='grid-item-time'>{data.time}</p>
              <p className='grid-item-other'> {data.name}</p>
              <p className='grid-item-other'> {data.note}</p>
            </Box>
          );
        })}
      </Box>
    </>
  );
};

export default UpcomingAppointments;
