import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, FavoriteBorder, Favorite, Star, Edit, PhotoCamera } from '@mui/icons-material';
import { getProductByIdAPI, updateProductAPI, addToCartAPI, addToWishlistAPI } from '../services/allAPI';
import { toast } from 'react-toastify';
import SERVER_URL from '../services/serviceURL';


const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [editedProduct, setEditedProduct] = useState(null);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role || null);

    // Check if product is liked from localStorage
    const savedLikedProducts = localStorage.getItem('likedProducts');
    const likedProducts = new Set(savedLikedProducts ? JSON.parse(savedLikedProducts) : []);
    setIsLiked(likedProducts.has(id));
  }, [id]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await getProductByIdAPI(id);
        if (result.status === 200) {
          setProduct(result.data);
        } else {
          setError('Failed to fetch product details');
          toast.error('Failed to fetch product details');
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError('Error fetching product details');
        toast.error('Error fetching product details');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const handleLike = async () => {
    try {
      setIsLoading(true);
      const result = await addToWishlistAPI({ productId: id });
      if (result.status === 200) {
        // Update localStorage
        const savedLikedProducts = localStorage.getItem('likedProducts');
        const likedProducts = new Set(savedLikedProducts ? JSON.parse(savedLikedProducts) : []);
        
        if (!isLiked) {
          likedProducts.add(id);
          toast.success('Item added to wishlist');
        } else {
          likedProducts.delete(id);
          toast.success('Item removed from wishlist');
        }
        
        localStorage.setItem('likedProducts', JSON.stringify(Array.from(likedProducts)));
        setIsLiked(!isLiked);
      } else {
        toast.error(result.data?.message || 'Failed to update wishlist');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Error updating wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setEditedProduct({ ...product });
    }
    setIsEditing(!isEditing);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setEditedProduct(prev => ({ ...prev, image: imageUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e, field) => {
    setEditedProduct(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleNutritionChange = (e, field) => {
    setEditedProduct(prev => ({
      ...prev,
      nutrition: {
        ...prev.nutrition,
        [field]: e.target.value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      // Create FormData object
      const formData = new FormData();
      formData.append('name', editedProduct.name);
      formData.append('price', editedProduct.price);
      formData.append('description', editedProduct.description);
      formData.append('category', editedProduct.category);
      formData.append('stock', product.stock); // Maintain existing stock
      
      // Append nutrition information
      Object.entries(editedProduct.nutrition).forEach(([key, value]) => {
        formData.append(`nutrition.${key}`, value);
      });
      
      // If there's a new image (base64), append it
      if (editedProduct.image && editedProduct.image.startsWith('data:')) {
        const response = await fetch(editedProduct.image);
        const blob = await response.blob();
        formData.append('image', blob, 'product-image.png');
      }

      const result = await updateProductAPI(id, formData);
      
      if (result.status === 200) {
        setProduct(result.data.product);
        setIsEditing(false);
        toast.success('Product updated successfully');
      } else {
        toast.error(result.data?.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      const result = await addToCartAPI({ productId: id, quantity: 1 });
      if (result.status === 200) {
        toast.success('Item added to cart');
        navigate('/cart');
      } else {
        toast.error(result.data?.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Error adding item to cart');
    } finally {
      setIsLoading(false);
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

  if (error || !product) {
    return (
      <Container className="pt-0 pb-5">
        <div className="text-center py-5 text-white">
          <h4>{error || 'Product not found'}</h4>
          <Button variant="outline-light" onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="pt-0 pb-5">
      <Row className="mb-5">
        <Col md={6}>
          <div 
            className="product-image-container"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '2rem',
              height: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <img
              src={isEditing && editedProduct?.image ? editedProduct.image : (product.image ? `${SERVER_URL}/uploads/${product.image}` : '/placeholder-image.png')}
              alt={product.name}
              style={{
                maxHeight: '100%',
                maxWidth: '100%',
                objectFit: 'contain'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-image.png';
              }}
            />
            {isEditing && (
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '50%',
                  padding: '8px',
                  cursor: 'pointer'
                }}
                onClick={() => document.getElementById('productImage').click()}
              >
                <PhotoCamera sx={{ color: 'white' }} />
                <input
                  type="file"
                  id="productImage"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
              </div>
            )}
          </div>
        </Col>
        <Col md={6}>
          <div className="product-info">
            {isEditing ? (
              <Form.Control
                type="text"
                value={editedProduct.name}
                onChange={(e) => handleInputChange(e, 'name')}
                className="mb-3"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              />
            ) : (
              <h2 className="text-white mb-3">{product.name}</h2>
            )}
            
            <div className="mb-3">
              <span className="text-white-50">Category :-  </span>
              {isEditing ? (
                <Form.Select
                  value={editedProduct.category}
                  onChange={(e) => handleInputChange(e, 'category')}
                  className="mt-2"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <option value="" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Select Category</option>
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
              ) : (
                <span className="text-white text-capitalize">{product.category}</span>
              )}
            </div>
            {isEditing ? (
              <Form.Control
                as="textarea"
                rows={3}
                value={editedProduct.description}
                onChange={(e) => handleInputChange(e, 'description')}
                className="mb-4"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              />
            ) : (
              <p className="text-white-50 mb-4">{product.description}</p>
            )}

            {isEditing ? (
              <Form.Control
                type="number"
                value={editedProduct.price}
                onChange={(e) => handleInputChange(e, 'price')}
                className="mb-4"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              />
            ) : (
              <h3 className="text-white mb-4">${product.price.toFixed(2)}</h3>
            )}
            
            <div className="d-flex gap-3 mb-4">
              {userRole === 'admin' ? (
                <Button 
                  variant="outline-light" 
                  className="px-4 py-2"
                  onClick={isEditing ? handleSave : handleEditToggle}
                >
                  <Edit className="me-2" />
                  {isEditing ? 'Save Changes' : 'Edit Product'}
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline-light" 
                    className="px-4 py-2"
                    onClick={handleAddToCart}
                    disabled={isLoading}
                  >
                    <ShoppingCart className="me-2" />
                    {isLoading ? 'Adding...' : 'Add to Cart'}
                  </Button>
                  <Button
                    variant="outline-light"
                    onClick={handleLike}
                    className="like-button px-3 py-2"
                    style={{ 
                      color: isLiked ? '#ff4081' : 'white',
                      borderColor: isLiked ? '#ff4081' : 'rgba(255,255,255,0.5)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {isLiked ? <Favorite /> : <FavoriteBorder />}
                  </Button>
                </>
              )}
            </div>

            <div 
              className="nutrition-info p-4 rounded"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <h4 className="text-white mb-3">Nutrition Information</h4>
              <Row>
                {product.nutrition && Object.entries(product.nutrition).map(([key, value]) => (
                  <Col xs={6} className="mb-2" key={key}>
                    <span className="text-white-50">{key.charAt(0).toUpperCase() + key.slice(1)} :</span>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        value={editedProduct.nutrition[key]}
                        onChange={(e) => handleNutritionChange(e, key)}
                        size="sm"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                      />
                    ) : (
                      <span className="text-white float-end">
                        {key === 'calories' ? `${value} kcal` : 
                         key === 'sugar' ? `${value} g` : 
                         key === 'caffeine' ? `${value} mg` : 
                         key ===  'serving' ? `${value} ml` : value
                         }
                      </span>
                    )}
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetails;