import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, useTheme } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Layout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Box sx={{ 
      flexGrow: 1, 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          backgroundColor: 'background.paper', 
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ 
            fontWeight: 700, 
            letterSpacing: '0.02em',
            background: 'linear-gradient(45deg, #3f51b5, #536dfe)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            paddingRight: 1
          }}>
            <Link to="/events" style={{ textDecoration: 'none' }}>
              Prodigious - Event
            </Link>
          </Typography>
          
          {user ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                component={Link} 
                to="/events"
                sx={{ 
                  color: theme.palette.text.primary,
                  fontWeight: 500,
                  px: 2,
                  borderRadius: 2,
                  '&:hover': { 
                    backgroundColor: 'rgba(63, 81, 181, 0.08)' 
                  },
                  '&.active': {
                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                    backgroundColor: 'rgba(63, 81, 181, 0.04)'
                  }
                }}
              >
                Events
              </Button>
              <Button 
                component={Link} 
                to="/my-registrations"
                sx={{ 
                  color: theme.palette.text.primary,
                  fontWeight: 500,
                  px: 2,
                  borderRadius: 2,
                  '&:hover': { 
                    backgroundColor: 'rgba(63, 81, 181, 0.08)' 
                  },
                  '&.active': {
                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                    backgroundColor: 'rgba(63, 81, 181, 0.04)'
                  }
                }}
              >
                My Registrations
              </Button>
              {isAdmin() && (
                <Button 
                  component={Link} 
                  to="/admin/events"
                  sx={{ 
                    color: theme.palette.text.primary,
                    fontWeight: 500,
                    px: 2,
                    borderRadius: 2,
                    '&:hover': { 
                      backgroundColor: 'rgba(63, 81, 181, 0.08)' 
                    },
                    '&.active': {
                      borderBottom: `2px solid ${theme.palette.primary.main}`,
                      backgroundColor: 'rgba(63, 81, 181, 0.04)'
                    }
                  }}
                >
                  Admin
                </Button>
              )}
              <Button 
                onClick={handleLogout}
                variant="contained"
                size="small"
                color="primary"
                sx={{ 
                  ml: 2,
                  fontWeight: 500,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(63, 81, 181, 0.25)',
                  }
                }}
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                component={Link} 
                to="/login"
                sx={{ 
                  color: theme.palette.text.primary,
                  fontWeight: 500,
                  px: 2,
                  borderRadius: 2,
                  '&:hover': { 
                    backgroundColor: 'rgba(63, 81, 181, 0.08)' 
                  }
                }}
              >
                Login
              </Button>
              <Button 
                component={Link} 
                to="/register"
                variant="contained"
                size="small"
                color="primary"
                sx={{ 
                  fontWeight: 500,
                  px: 3,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(63, 81, 181, 0.25)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      <Container 
        maxWidth="lg" 
        sx={{ 
          mt: 6, 
          mb: 8, 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box className="fade-in" sx={{ width: '100%' }}>
          {children}
        </Box>
      </Container>
    </Box>
  );
};

export default Layout;