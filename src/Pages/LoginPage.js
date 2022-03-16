import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, useAuth } from '../firebase';

const LoginPage = () => {
  const currentUser = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      console.log(error);
    }
    navigate('/dashboard');
  };

  useEffect(() => {
    console.log(currentUser);
  }, []);

  return (
    <>
      <Container
        maxWidth='sm'
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Card
          sx={{
            maxWidth: '330px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <CardContent>
            <Typography
              varient='h1'
              sx={{
                marginBottom: '10px',
                fontSize: '50px',
                padding: '10px',
              }}
            >
              Aegle Clinic
            </Typography>
            <TextField
              required
              id='outlined-basic'
              label='Email'
              variant='outlined'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ width: '300px' }}
            />
            <TextField
              required
              id='outlined-password-basic'
              label='Password'
              variant='outlined'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ width: '300px', marginTop: '20px' }}
            />
            <Button
              variant='contained'
              sx={{ width: '300px', marginTop: '20px', height: '50px' }}
              onClick={handleLogin}
            >
              Login
            </Button>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default LoginPage;
