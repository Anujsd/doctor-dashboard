import Homepage from './Pages/Homepage';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/dashboard' element={<Homepage />} />
      </Routes>
    </div>
  );
}

export default App;
