import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Spinner, Pagination } from 'react-bootstrap';
import { Search, FilterList, Favorite, FavoriteBorder, Mic, MicOff, Info, ShoppingCart } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAllProductsAPI, addToCartAPI, addToWishlistAPI } from '../services/allAPI';
import { toast } from 'react-toastify';
import SERVER_URL from '../services/serviceURL';



const Products = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [likedProducts, setLikedProducts] = useState(() => {
    const savedLikedProducts = localStorage.getItem('likedProducts');
    return new Set(savedLikedProducts ? JSON.parse(savedLikedProducts) : []);
  });
  const [userRole, setUserRole] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role || null);

    // Get category from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
      // Convert category parameter to match the format in the select options
      const formattedCategory = categoryParam.split('/').pop().split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      setSelectedCategory(formattedCategory);
    }
  }, []);
  const handleLike = async (productId) => {
    try {
      const result = await addToWishlistAPI({ productId });
      if (result.status === 200) {
        setLikedProducts(prev => {
          const newLiked = new Set(prev);
          if (newLiked.has(productId)) {
            newLiked.delete(productId);
          } else {
            newLiked.add(productId);
          }
          // Save to localStorage
          localStorage.setItem('likedProducts', JSON.stringify(Array.from(newLiked)));
          return newLiked;
        });
        toast.success('Item added to wishlist');
      } else {
        toast.error(result.data?.message || 'Failed to add item to wishlist');
      }
    } catch (error) {
      console.error('Error adding item to wishlist:', error);
      toast.error('Error adding item to wishlist');
    }
  };
  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = async (productId) => {
    try {
      const result = await addToCartAPI({ productId, quantity: 1 });
      if (result.status === 200) {
        toast.success('Item added to cart');
        navigate('/cart');
      } else {
        toast.error(result.data?.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Error adding item to cart');
    }
  };
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await getAllProductsAPI();
        if (result.status === 200) {
          setProducts(result.data);
        } else {
          setError('Failed to fetch products');
          toast.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Error fetching products');
        toast.error('Error fetching products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);
  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === 'all' || product.category === selectedCategory)
    )
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  // Get current products for pagination
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };
  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };
  return (
    <>
      <Container className="pt-0 pb-5">  {/* Changed from py-5 to pt-0 pb-5 */}
        <Row className="mb-4">
          <Col md={4}>
            <InputGroup>
              <InputGroup.Text style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', color: 'white' }}>
                <Search />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '::placeholder': {
                    color: 'rgba(255, 255, 255, 0.8)'
                  }
                }}
                className="search-input"
              />
              <Button
                variant="outline-light"
                onClick={handleVoiceSearch}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease'
                }}
              >
                {isListening ? <MicOff style={{ color: '#ff4081' }} /> : <Mic />}
              </Button>
            </InputGroup>
          </Col>
          <Col md={4}>
            <Form.Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white'
              }}
              className="custom-select"
            >
              <option value="all" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>All Categories</option>
              <option value="Soft Drinks" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Soft Drinks</option>
              <option value="Energy Drinks" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Energy Drinks</option>
              <option value="Coffee" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Coffee</option>
              <option value="Tea" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Tea</option>
              <option value="Smoothies" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Smoothies</option>
              <option value="Mocktails" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Mocktails</option>
              <option value="Water" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Water</option>
              <option value="Sports Drinks" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Sports Drinks</option>
              <option value="Wine" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Wine</option>
            </Form.Select>
          </Col>
          <Col md={4}>  {/* Moved to its own column */}
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white'
              }}
              className="custom-select"
            >
              <option value="featured" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Featured</option>
              <option value="price-low" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Price: Low to High</option>
              <option value="price-high" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Price: High to Low</option>
              <option value="name" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Name</option>
            </Form.Select>
          </Col>
        </Row>
  
        {isLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="light" />
          </div>
        ) : error ? (
          <div className="text-center py-5 text-white">
            <h4>{error}</h4>
            <Button variant="outline-light" onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : (
          <Row xs={1} md={2} lg={4} className="g-4">
            {currentProducts.map(product => (
            <Col key={product._id}>
              <Card className="h-100" style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="position-relative">
                  <Card.Img 
                    variant="top" 
                    src={product.image ? `${SERVER_URL}/uploads/${product.image}` : '/placeholder-image.png'}
                    style={{ height: '200px', objectFit: 'contain', padding: '1rem' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-image.png';
                    }}
                  />
                  <IconButton
                    onClick={() => handleViewDetails(product._id)}
                    sx={{ 
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        color: '#2196F3',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.3s ease'
                      }
                    }}
                  >
                    <Info />
                  </IconButton>
                </div>
                <Card.Body className="text-white text-center">
                  <Card.Title>{product.name || 'Untitled Product'}</Card.Title>
                  <Card.Text className="fw-bold">${(product.price || 0).toFixed(2)}</Card.Text>
                  {userRole !== 'admin' && (
                    <div className="d-flex justify-content-center gap-2">
                      <Button 
                        variant="outline-light"
                        onClick={() => handleAddToCart(product._id)}
                      >Add to Cart</Button>
                      <Button
                        variant="outline-light"
                        onClick={() => handleLike(product._id)}
                        className="like-button"
                        style={{ 
                          color: likedProducts.has(product._id) ? '#ff4081' : 'white',
                          borderColor: likedProducts.has(product._id) ? '#ff4081' : 'rgba(255,255,255,0.5)',
                          transition: 'all 0.3s ease',
                          padding: '6px 12px'
                        }}
                      >
                        {likedProducts.has(product._id) ? <Favorite /> : <FavoriteBorder />}
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      {!isLoading && !error && filteredProducts.length > 0 && (
        <div className="d-flex justify-content-center mt-4">
          <div className="d-flex align-items-center gap-3">
            <Form.Select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                width: 'auto'
              }}
            >
              <option value="8" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>8 per page</option>
              <option value="12" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>12 per page</option>
              <option value="16" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>16 per page</option>
              <option value="20" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>20 per page</option>
            </Form.Select>
            <Pagination className="mb-0" style={{ '--bs-pagination-bg': 'rgba(255, 255, 255, 0.1)', '--bs-pagination-color': 'white', '--bs-pagination-border-color': 'rgba(255, 255, 255, 0.2)', '--bs-pagination-hover-bg': 'rgba(33, 150, 243, 0.2)', '--bs-pagination-hover-color': '#2196F3', '--bs-pagination-hover-border-color': '#2196F3', '--bs-pagination-active-bg': '#2196F3', '--bs-pagination-active-border-color': '#2196F3', '--bs-pagination-disabled-bg': 'rgba(255, 255, 255, 0.05)', '--bs-pagination-disabled-color': 'rgba(255, 255, 255, 0.5)', '--bs-pagination-disabled-border-color': 'rgba(255, 255, 255, 0.1)' }}>
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={currentPage === index + 1}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        </div>
      )}
      </Container>
    </>
  );
};

export default Products;
