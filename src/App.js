import Homepage from './Pages/Homepage';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import PatientsPage from './Pages/PatientsPage';
import Appointment from './Pages/Appointment';
import Dashboard from './Pages/Dashboard';
import SinglePatient from './Pages/SinglePatient';
import { getAppointmentsData } from './firebase';
import { useEffect, useMemo, useState } from 'react';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/' element={<Homepage components={<Dashboard />} />} />
        <Route
          path='/patients'
          element={<Homepage components={<PatientsPage />} />}
        />
        <Route
          path='/patients/:id'
          element={<Homepage components={<SinglePatient />} />}
        />
        <Route
          path='/appointment'
          element={<Homepage components={<Appointment />} />}
        />
      </Routes>
    </div>
  );
}

export default App;
