import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import Dashboard from './Dashboard';
import Appointment from './Appointment';
import DoctorsPage from './DoctorsPage';
import PatientsPage from './PatientsPage';
import { Avatar, Button } from '@mui/material';
import { logout, useAuth } from '../firebase';
import { Navigate, useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Homepage() {
  const [showDashboard, setShowDashboard] = useState(true);
  const [showPatients, setShowPatients] = useState(false);
  const [showAppointment, setShowAppointment] = useState(false);
  const [showDoctors, setShowDoctors] = useState(false);

  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const currentUser = useAuth();
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
    console.log(currentUser);
    navigate('/');
  };

  return (
    <>
      {currentUser && (
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position='fixed' open={open}>
            <Toolbar>
              <IconButton
                color='inherit'
                aria-label='open drawer'
                onClick={handleDrawerOpen}
                edge='start'
                sx={{ mr: 2, ...(open && { display: 'none' }) }}
              >
                <MenuIcon />
              </IconButton>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Typography variant='h6' noWrap component='div'>
                  Persistent drawer
                </Typography>
                <Button variant='button' onClick={handleLogout}>
                  Logout
                </Button>
              </Box>
            </Toolbar>
          </AppBar>
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
              },
            }}
            variant='persistent'
            anchor='left'
            open={open}
          >
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'ltr' ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              <ListItem>
                <ListItemIcon>
                  <Avatar src={currentUser?.photoURL}>D</Avatar>
                </ListItemIcon>
                <ListItemText primary={currentUser?.email.slice(5)} />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  setShowDashboard(true);
                  setShowAppointment(false);
                  setShowDoctors(false);
                  setShowPatients(false);
                }}
              >
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary={'Dashboard'} />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  setShowDashboard(false);
                  setShowAppointment(false);
                  setShowDoctors(false);
                  setShowPatients(true);
                }}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary={'Patients'} />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  setShowDashboard(false);
                  setShowAppointment(true);
                  setShowDoctors(false);
                  setShowPatients(false);
                }}
              >
                <ListItemIcon>
                  <CalendarTodayIcon />
                </ListItemIcon>
                <ListItemText primary={'Appointment'} />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  setShowDashboard(false);
                  setShowAppointment(false);
                  setShowDoctors(true);
                  setShowPatients(false);
                }}
              >
                <ListItemIcon>
                  <AssignmentIndIcon />
                </ListItemIcon>
                <ListItemText primary={'Doctors'} />
              </ListItem>
            </List>
          </Drawer>
          <Main open={open}>
            <DrawerHeader />
            <Box sx={{ border: '1px solid black' }}>
              {showDashboard && <Dashboard />}
              {showPatients && <PatientsPage />}
              {showDoctors && <DoctorsPage />}
              {showAppointment && <Appointment />}
            </Box>
          </Main>
        </Box>
      )}
    </>
  );
}
