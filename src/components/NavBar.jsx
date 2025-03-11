
import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Box, useTheme, useMediaQuery, Badge, Divider } from '@mui/material';
import { AccountCircle, Brightness4, Brightness7, Menu as MenuIcon, ShoppingCart, Search, Favorite, LocalOffer, Dashboard } from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCartItemsAPI, getWishlistItemsAPI } from '../services/allAPI';

const NavBar = ({ mode, onThemeToggle }) => {

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [wishlistItemsCount, setWishlistItemsCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setIsAuthenticated(!!token);
    setUserRole(user.role || null);
    
   
  
    // Fetch cart and wishlist items count
    const fetchCounts = async () => {
      if (token && user.role !== 'admin') {
        try {
          const [cartResult, wishlistResult] = await Promise.all([
            getCartItemsAPI(),
            getWishlistItemsAPI()
          ]);
          
          if (cartResult.status === 200) {
            const totalCartItems = cartResult.data.reduce((total, item) => total + item.quantity, 0);
            setCartItemsCount(totalCartItems);
          }
          
          if (wishlistResult.status === 200) {
            setWishlistItemsCount(wishlistResult.data.length);
          }
        } catch (error) {
          console.error('Error fetching counts:', error);
        }
      }
    };
    fetchCounts();
  }, [location.pathname]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    handleClose();
    navigate('/');
  };

  const menuItems = [
    { text: 'Home', path: '/', requiresAuth: false },
    { text: 'Products', path: '/products', requiresAuth: true },
    { text: 'Categories', path: '/categories', requiresAuth: true },
    { text: 'Review Us', path: '/review', requiresAuth: true, hideForAdmin: true },
    { text: 'About Us', path: '/about', requiresAuth: false },
    { text: 'Contact', path: '/contact', requiresAuth: false },
  ];

  const filteredMenuItems = menuItems.filter(item => (!item.requiresAuth || isAuthenticated) && (!item.hideForAdmin || userRole !== 'admin'));

  return (
    <AppBar position="sticky" sx={{ 
      mb: 1, 
      py: 1, 
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.0)' : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
    }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" component={Link} to="/" sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textDecoration: 'none',
            '&:hover': {
              transform: 'translateY(-2px)',
              transition: 'all 0.3s'
            }
          }}>
            <i className="fa-solid fa-wine-bottle me-2"></i>
            Liquid Luxury
          </Typography>
        </Box>

        {isMobile ? (
          <Box>
            <IconButton
              id="mobile-menu-button"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={document.getElementById('mobile-menu-button')}
              open={mobileOpen}
              onClose={handleDrawerToggle}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              PaperProps={{
                sx: {
                  mt: 5,
                  ml: 1
                }
              }}
            >
              {filteredMenuItems.map((item) => (
                <MenuItem 
                  key={item.text} 
                  component={Link} 
                  to={item.path}
                  onClick={handleDrawerToggle}
                  sx={{
                    backgroundColor: location.pathname === item.path ? 'rgba(33, 150, 243, 0.1)' : 'transparent',
                    color: location.pathname === item.path ? '#2196F3' : 'inherit',
                    '&:hover': {
                      backgroundColor: 'rgba(33, 150, 243, 0.1)'
                    }
                  }}
                >
                  {item.text}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {filteredMenuItems.map((item) => (
              <Button 
                key={item.text} 
                component={Link} 
                to={item.path}
                sx={{
                  color: location.pathname === item.path ? '#2196F3' : 'inherit',
                  borderBottom: location.pathname === item.path ? '2px solid #2196F3' : 'none',
                  borderRadius: 0,
                  '&:hover': {
                    color: '#2196F3',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s'
                  }
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isAuthenticated && userRole !== 'admin' && (
            <>
              <IconButton color="inherit" component={Link} to="/wishlist">
                <Badge badgeContent={wishlistItemsCount} color="error">
                  <Favorite />
                </Badge>
              </IconButton>

              <IconButton color="inherit" component={Link} to="/cart">
                <Badge badgeContent={cartItemsCount} color="error">
                  <ShoppingCart />
                </Badge>
              </IconButton>
            </>
          )}

          {/* <IconButton display="none" sx={{ ml: 1 }} onClick={onThemeToggle} color="inherit">
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton> */}

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isAuthenticated && userRole === 'admin' && (
              <Typography variant="body2" sx={{ mr: 1, color: 'primary.main' }}>
                Admin
              </Typography>
            )}
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 2
              }
            }}
          >
            {isAuthenticated ? [
              <MenuItem 
                key="profile"
                component={Link} 
                to="/profile"
                onClick={handleClose}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    color: '#2196F3'
                  }
                }}
              >
                <AccountCircle sx={{ mr: 1 }} /> My Profile
              </MenuItem>,
              userRole === 'admin' ? (
                <MenuItem
                  key="admin"
                  component={Link}
                  to="/admin"
                  onClick={handleClose}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(33, 150, 243, 0.1)',
                      color: '#2196F3'
                    }
                  }}
                >
                  <Dashboard sx={{ mr: 1 }} /> Admin Dashboard
                </MenuItem>
              ) : [
                <MenuItem 
                  key="orders"
                  component={Link} 
                  to="/orderhistory"
                  onClick={handleClose}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(33, 150, 243, 0.1)',
                      color: '#2196F3'
                    }
                  }}
                >
                  <ShoppingCart sx={{ mr: 1 }} /> Order History
                </MenuItem>,
                <MenuItem 
                  key="wishlist"
                  component={Link} 
                  to="/wishlist"
                  onClick={handleClose}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(33, 150, 243, 0.1)',
                      color: '#2196F3'
                    }
                  }}
                >
                  <Favorite sx={{ mr: 1 }} /> Wishlist
                </MenuItem>
              ],
              <Divider key="divider" />,
              <MenuItem key="logout" onClick={handleLogout} sx={{ color: 'error.main' }}>
                Logout
              </MenuItem>
            ] : [
                <MenuItem 
                  key="login"
                  component={Link} 
                  to="/login"
                  onClick={handleClose}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(33, 150, 243, 0.1)',
                      color: '#2196F3'
                    }
                  }}
                >
                  <AccountCircle sx={{ mr: 1 }} /> Login
                </MenuItem>,
                <MenuItem 
                  key="register"
                  component={Link} 
                  to="/signup"
                  onClick={handleClose}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(33, 150, 243, 0.1)',
                      color: '#2196F3'
                    }
                  }}
                >
                  <AccountCircle sx={{ mr: 1 }} /> Register
                </MenuItem>
            ]}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;