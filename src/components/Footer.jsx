import React from 'react';
import { Box, Container, Grid, Typography, IconButton, Link, useTheme } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, Email, Phone, LocationOn } from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.mode === 'light' ? '#1976d2' : '#1e1e1e',
        color: '#ffffff',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ color: '#2196f3' }}>
              About Us
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Your premier destination for premium beverages. We offer a curated selection of drinks from around the world, ensuring quality and satisfaction.
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOn sx={{ mr: 1, fontSize: 'small' }} />
                Mon-Fri: 9:00 AM - 10:00 PM
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ mr: 1, fontSize: 'small' }} />
                Sat-Sun: 10:00 AM - 8:00 PM
              </Box>
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ color: '#2196f3' }}>
              Quick Links
            </Typography>
            <Link 
              href="/" 
              color="inherit" 
              sx={{ 
                display: 'block', 
                mb: 1,
                '&:hover': {
                  color: '#2196f3', // Material-UI blue
                  textDecoration: 'none',
                  transform: 'translateX(5px)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              Home
            </Link>
            <Link href="/products" color="inherit" sx={{ 
              display: 'block', 
              mb: 1,
              '&:hover': {
                color: '#2196f3',
                textDecoration: 'none',
                transform: 'translateX(5px)',
                transition: 'all 0.3s ease'
              }
            }}>
              Products
            </Link>
            <Link href="/about" color="inherit" sx={{ 
              display: 'block', 
              mb: 1,
              '&:hover': {
                color: '#2196f3',
                textDecoration: 'none',
                transform: 'translateX(5px)',
                transition: 'all 0.3s ease'
              }
            }}>
              About Us
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ color: '#2196f3' }}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Email sx={{ mr: 1 }} />
              <Typography variant="body2">
                Email: shibindaniel@beveragestore.com<br />
                Sales: sales@beveragestore.com
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Phone sx={{ mr: 1 }} />
              <Typography variant="body2">
                Support: +1 234 567 8900<br />
                Sales: +1 234 567 8901
              </Typography>
            </Box>
            <Typography variant="h6" gutterBottom sx={{ mt: 3, color: '#2196f3' }}>
              Follow Us
            </Typography>
            <IconButton 
              color="inherit" 
              aria-label="Facebook"
              sx={{
                '&:hover': {
                  color: '#2196f3',
                  transform: 'translateY(-3px)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <Facebook />
            </IconButton>
            <IconButton 
              color="inherit" 
              aria-label="Twitter"
              sx={{
                '&:hover': {
                  color: '#2196f3',
                  transform: 'translateY(-3px)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <Twitter />
            </IconButton>
            <IconButton 
              color="inherit" 
              aria-label="Instagram"
              sx={{
                '&:hover': {
                  color: '#2196f3',
                  transform: 'translateY(-3px)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <Instagram />
            </IconButton>
            <IconButton 
              color="inherit" 
              aria-label="LinkedIn"
              sx={{
                '&:hover': {
                  color: '#2196f3',
                  transform: 'translateY(-3px)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <LinkedIn />
            </IconButton>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ color: '#2196f3' }}>
              Newsletter
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Subscribe to our newsletter for updates, exclusive offers, and beverage tips!
            </Typography>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid white',
                  backgroundColor: 'transparent',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Subscribe
              </button>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ borderTop: 1, borderColor: 'rgba(255, 255, 255, 0.1)', mt: 4, pt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="inherit">
            © {new Date().getFullYear()} Beverage Store. All rights reserved to shibin daniel
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;