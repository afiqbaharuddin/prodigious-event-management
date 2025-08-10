import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  useTheme
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  
  const { login } = useAuth();
  const navigate  = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/events');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <Container 
      component="main" 
      maxWidth="xs" 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%'
      }}
    >
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          width: '100%',
          backgroundColor: 'background.paper'
        }}
      >
        <Typography 
          component="h1" 
          variant="h5" 
          align="center" 
          gutterBottom
          sx={{ 
            fontWeight: 300, 
            letterSpacing: 1,
            color: theme.palette.text.primary,
            mb: 4
          }}
        >
          SIGN IN
        </Typography>
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              backgroundColor: 'rgba(211, 47, 47, 0.1)', 
              color: '#f44336',
              '& .MuiAlert-icon': {
                color: '#f44336'
              }
            }}
          >
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            autoFocus
            variant="outlined"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: theme.palette.divider,
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
            InputProps={{
              sx: { borderRadius: 1 }
            }}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            variant="outlined"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: theme.palette.divider,
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
            InputProps={{
              sx: { borderRadius: 1 }
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ 
              mt: 3, 
              mb: 3,
              py: 1.2,
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.background.default,
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
                boxShadow: 'none',
              },
              '&:disabled': {
                backgroundColor: 'rgba(144, 202, 249, 0.2)',
              },
              letterSpacing: 0.5,
              borderRadius: 1
            }}
            disableElevation
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
          
          <Box textAlign="center">
            <Link 
              to="/register"
              style={{ 
                color: theme.palette.primary.main,
                textDecoration: 'none',
                fontSize: '0.9rem'
              }}
            >
              Don't have an account? Sign Up
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;