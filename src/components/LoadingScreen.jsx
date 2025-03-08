import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
      }}
    >
      <CircularProgress
        size={60}
        thickness={4}
        sx={{
          color: '#2196F3',
          mb: 2,
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }}
      />
      <Typography
        variant="h6"
        sx={{
          color: 'white',
          textAlign: 'center',
          animation: 'pulse 1.5s ease-in-out infinite',
          '@keyframes pulse': {
            '0%': {
              opacity: 0.6,
            },
            '50%': {
              opacity: 1,
            },
            '100%': {
              opacity: 0.6,
            },
          },
        }}
      >
        Loading...
      </Typography>
    </Box>
  );
};

export default LoadingScreen;