import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { ShoppingCart, Delete, FilterList } from '@mui/icons-material';
import { IconButton, Menu, MenuItem, Box, Typography } from '@mui/material';
import { getWishlistItemsAPI, removeFromWishlistAPI, addToCartAPI } from '../services/allAPI';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import SERVER_URL from '../services/serviceURL';


const Wishlist = () => {
  const [sortBy, setSortBy] = useState('date');
  const [anchorEl, setAnchorEl] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    try {
      setIsLoading(true);
      const result = await getWishlistItemsAPI();
      if (result.status === 200) {
        setWishlistItems(result.data);
      } else {
        toast.error('Failed to fetch wishlist items');
      }
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
      toast.error('Error fetching wishlist items');
    } finally {
      setIsLoading(false);
    }
  };



  const handleSortClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setAnchorEl(null);
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
    setAnchorEl(null);

    const sortedItems = [...wishlistItems];
    switch (sortType) {
      case 'price-low':
        sortedItems.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sortedItems.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        sortedItems.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'date':
        sortedItems.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
        break;
      default:
        break;
    }
    setWishlistItems(sortedItems);
  };

  const removeFromWishlist = async (id) => {
    try {
      const result = await removeFromWishlistAPI(id);
      if (result.status === 200) {
        // Get the product ID before updating the wishlist items
        const removedItem = wishlistItems.find(item => item._id === id);
        
        // Fetch updated wishlist items
        const updatedResult = await getWishlistItemsAPI();
        if (updatedResult.status === 200) {
          setWishlistItems(updatedResult.data);
          
          // If this was the last item, clear the localStorage
          if (updatedResult.data.length === 0) {
            localStorage.removeItem('likedProducts');
          } else if (removedItem) {
            // Otherwise, just remove this specific item
            const savedLikedProducts = localStorage.getItem('likedProducts');
            const likedProducts = new Set(savedLikedProducts ? JSON.parse(savedLikedProducts) : []);
            likedProducts.delete(removedItem.product._id);
            localStorage.setItem('likedProducts', JSON.stringify(Array.from(likedProducts)));
          }
        }
        
        toast.success('Item removed from wishlist');
      } else {
        toast.error('Failed to remove item from wishlist');
      }
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
      toast.error('Error removing item from wishlist');
    }
  };

  const handleAddToCart = async (productId, wishlistItemId) => {
    try {
      const result = await addToCartAPI({ productId, quantity: 1 });
      if (result.status === 200) {
        // After successfully adding to cart, remove from wishlist
        await removeFromWishlist(wishlistItemId);
        toast.success('Item added to cart');
      } else {
        toast.error(result.data?.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Error adding item to cart');
    }
  };

  if (isLoading) {
    return (
      <Container className="pt-0 pb-5">
        <div className="text-center py-5">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="pt-0 pb-5">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" className="text-white">
          My Wishlist
        </Typography>
        <Box>
          <IconButton 
            onClick={handleSortClick}
            sx={{ 
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            <FilterList />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleSortClose}
            PaperProps={{
              sx: {
                backgroundColor: 'rgba(30, 30, 30, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <MenuItem 
              onClick={() => handleSortChange('date')} 
              sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.1)' } }}
            >
              Date Added
            </MenuItem>
            <MenuItem 
              onClick={() => handleSortChange('price-low')} 
              sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.1)' } }}
            >
              Price: Low to High
            </MenuItem>
            <MenuItem 
              onClick={() => handleSortChange('price-high')} 
              sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.1)' } }}
            >
              Price: High to Low
            </MenuItem>
            <MenuItem 
              onClick={() => handleSortChange('name')} 
              sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.1)' } }}
            >
              Name
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {wishlistItems.length === 0 ? (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Typography variant="h6" className="text-white-50 mb-3">
            Your wishlist is empty
          </Typography>
          <Button 
            variant="outline-light"
            href="/products"
            className="mt-2"
          >
            Continue Shopping
          </Button>
        </Box>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {wishlistItems.map((item) => (
            <Col key={item.id}>
              <Card 
                className="h-100" 
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px'
                }}
              >
                <Card.Img 
                  variant="top" 
                  src={`${SERVER_URL}/uploads/${item.product.image}`}
                  style={{ 
                    height: '200px',
                    objectFit: 'contain',
                    padding: '1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)'
                  }}
                />
                <Card.Body className="text-white">
                  <Card.Title>{item.product.name}</Card.Title>
                  <Card.Text className="text-primary fw-bold">
                    ${item.product.price.toFixed(2)}
                  </Card.Text>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', mt: 2 }}>
                    <Button 
                      variant="outline-light" 
                      className="w-100"
                      onClick={() => handleAddToCart(item.product._id, item._id)}
                      style={{
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <ShoppingCart sx={{ mr: 1 }} /> Add to Cart
                    </Button>
                    <IconButton
                      onClick={() => removeFromWishlist(item._id)}
                      sx={{ 
                        color: '#ff4081',
                        border: '1px solid rgba(255, 64, 129, 0.5)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 64, 129, 0.1)',
                          border: '1px solid #ff4081'
                        }
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Wishlist;