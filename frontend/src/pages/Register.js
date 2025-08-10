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

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate     = useNavigate();
  const theme = useTheme();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.password_confirmation
    );
    
    if (result.success) {
      navigate('/events');
    } else {
      setErrors(result.errors || {});
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
          SIGN UP
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name?.[0]}
            autoComplete="name"
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
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email?.[0]}
            autoComplete="email"
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
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password?.[0]}
            autoComplete="new-password"
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
            label="Confirm Password"
            name="password_confirmation"
            type="password"
            value={formData.password_confirmation}
            onChange={handleChange}
            autoComplete="new-password"
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
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
          
          <Box textAlign="center">
            <Link 
              to="/login"
              style={{ 
                color: theme.palette.primary.main,
                textDecoration: 'none',
                fontSize: '0.9rem'
              }}
            >
              Already have an account? Sign In
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;