import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, IconButton, InputAdornment, Paper, Grid } from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { Link ,useNavigate} from 'react-router-dom';
import AuthImagePattern from './AuthImagePattern';
import { loginAPI } from '../services/allAPI';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    profilePic: ''
  });

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Invalid email format');
      return false;
    }
    if (!formData.password) {
      toast.error('Password is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await loginAPI(formData);
      console.log('Login result:', result);

      if (result.status === 200) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        const userRole = result.data.user.role;
        const username = result.data.user.username;
        toast.success(`Welcome back ${username}${userRole === 'admin' ? ' (Admin)' : ''}!`);
        setTimeout(() => {
          // Redirect based on user role
          if (userRole === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 2000);
        setFormData({ email: '', password: '' });
      } else if (result.response?.status === 400) {
        toast.error('Invalid credentials. Please check your email and password.');
        setFormData({ ...formData, password: '' });
      } else {
        const errorMessage = result.response?.data?.message || 'An error occurred during login';
        toast.error(errorMessage);
        setFormData({ ...formData, password: '' });
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred during login';
      toast.error(errorMessage);
      setFormData({ ...formData, password: '' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="pt-0 pb-5">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Grid container spacing={3} justifyContent="center" alignItems="flex-start" style={{ minHeight: '70vh', paddingTop: '2rem' }}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4,
              backgroundColor: 'transparent',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" component="h1" sx={{ color: 'white', mb: 2 }}>
                Welcome Back
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Sign in to your account
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleShowPassword}
                          edge="end"
                          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                  }}
                />
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  mb: 2,
                  py: 1.5,
                  backgroundColor: '#2196F3',
                  '&:hover': {
                    backgroundColor: '#1976D2',
                  },
                }}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              <Typography variant="body2" align="center" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  style={{ 
                    color: '#2196F3',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Sign up
                </Link>
              </Typography>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <AuthImagePattern 
            title={"Welcome Back to Beverage Store"} 
            subtitle={"Sign in to access your account and explore our premium collection of beverages."}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;