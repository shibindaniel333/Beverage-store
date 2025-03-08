import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <Container className="pt-0 pb-5">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          textAlign: 'center',
          gap: 3
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '6rem', md: '8rem' },
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          404
        </Typography>

        <Typography
          variant="h4"
          sx={{
            color: 'text.primary',
            mb: 2
          }}
        >
          Oops! Page Not Found
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            maxWidth: '600px',
            mb: 4
          }}
        >
          The page you are looking for might have been restricted, had its name changed,
          or is temporarily unavailable.
        </Typography>

        <Button
          variant="contained"
          startIcon={<Home />}
          onClick={() => navigate('/')}
          sx={{
            py: 1.5,
            px: 4,
            backgroundColor: '#2196F3',
            '&:hover': {
              backgroundColor: '#1976D2',
              transform: 'translateY(-2px)',
              transition: 'all 0.3s'
            }
          }}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default PageNotFound;