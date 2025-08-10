import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/animations.css';

import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';
import MyRegistrations from './pages/MyRegistrations';
import AdminEvents from './pages/admin/AdminEvents';
import CreateEvent from './pages/admin/CreateEvent';
import EditEvent from './pages/admin/EditEvent';
import ProtectedRoute from './components/ProtectedRoute';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3f51b5', // Modern indigo blue
      light: '#6573c3',
      dark: '#2c387e',
    },
    secondary: {
      main: '#ff6d00', // Vibrant orange
      light: '#ff8c33',
      dark: '#c43c00',
    },
    background: {
      default: '#f9f9f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
    error: {
      main: '#f44336',
    },
    success: {
      main: '#4caf50',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 500,
      letterSpacing: '0.0075em',
    },
    button: {
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 12,
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: 'hidden',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'box-shadow 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            },
            '&.Mui-focused': {
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            },
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/events" element={<EventList />} />
              <Route path="/events/:id" element={<EventDetail />} />
              
              <Route path="/my-registrations" element={
                <ProtectedRoute><MyRegistrations /></ProtectedRoute>
              } />
              
              <Route path="/admin/events" element={
                <ProtectedRoute adminOnly><AdminEvents /></ProtectedRoute>
              } />
              <Route path="/admin/events/create" element={
                <ProtectedRoute adminOnly><CreateEvent /></ProtectedRoute>
              } />
              <Route path="/admin/events/:id/edit" element={
                <ProtectedRoute adminOnly><EditEvent /></ProtectedRoute>
              } />
              
              <Route path="/" element={<Navigate to="/events" />} />
            </Routes>
          </Layout>
        </Router>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastStyle={{
            backgroundColor: '#ffffff',
            color: '#333333',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            borderRadius: '12px'
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
