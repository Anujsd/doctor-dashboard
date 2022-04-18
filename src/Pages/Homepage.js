import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import { Button } from '@mui/material';
import { logout, useAuth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 220;

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

export default function Homepage({ components }) {
  const currentUser = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
    console.log(currentUser);
    navigate('/login');
  };

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Typography
        sx={{
          width: '100%',
          textAlign: 'center',
          marginTop: '10px',
          fontSize: '30px',
          fontWeight: '900',
          color: '#9966ff',
        }}
      >
        <img
          src='https://www.aegleclinic.com/images/logo_2020.png'
          alt='Aegle Clinic'
        />
      </Typography>
      <List sx={{ color: '#808080' }}>
        <ListItem
          button
          onClick={() => {
            navigate('/');
          }}
          sx={{ '&:hover': { color: '#000000' } }}
        >
          <ListItemIcon>
            <HomeIcon sx={{ color: '#9999ff' }} />
          </ListItemIcon>
          <ListItemText primary={'Dashboard'} />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            navigate('/patients');
          }}
          sx={{ '&:hover': { color: '#000000' } }}
        >
          <ListItemIcon>
            <PersonIcon sx={{ color: '#006600' }} />
          </ListItemIcon>
          <ListItemText primary={'Patients'} />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            navigate('/appointment');
          }}
        >
          <ListItemIcon>
            <CalendarTodayIcon sx={{ color: '#00cc00' }} />
          </ListItemIcon>
          <ListItemText primary={'Appointment'} />
        </ListItem>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window.document.body : undefined;

  return (
    <>
      {currentUser && (
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar
            position='fixed'
            sx={{
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              ml: { sm: `${drawerWidth}px` },
              backgroundColor: 'white',
              boxShadow: '0',
            }}
          >
            <Toolbar>
              <IconButton
                color='inherit'
                aria-label='open drawer'
                edge='start'
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'right',
                  width: '100%',
                  color: '#9966ff',
                }}
              >
                <div>
                  <Button
                    variant='button'
                    onClick={handleLogout}
                    sx={{
                      backgroundColor: '#9966ff',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#4400cc',
                      },
                      margin: '10px',
                    }}
                  >
                    Logout
                  </Button>
                </div>
              </Box>
            </Toolbar>
          </AppBar>
          <Box
            component='nav'
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label='mailbox folders'
          >
            <Drawer
              container={container}
              variant='temporary'
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
              sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': {
                  boxSizing: 'border-box',
                  width: drawerWidth,
                },
              }}
            >
              {drawer}
            </Drawer>
            <Drawer
              variant='permanent'
              sx={{
                display: { xs: 'none', sm: 'block' },
                '& .MuiDrawer-paper': {
                  boxSizing: 'border-box',
                  width: drawerWidth,
                },
              }}
              open
            >
              {drawer}
            </Drawer>
          </Box>
          <Box
            component='main'
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: `calc(100% - ${drawerWidth}px)` },
            }}
          >
            <DrawerHeader />
            <Box sx={{}}>{components}</Box>
          </Box>
        </Box>
      )}
      {!currentUser && navigate('/login')}
    </>
  );
}
