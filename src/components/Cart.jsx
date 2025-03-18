import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap'
import { ShoppingCart, Delete, Payment, CreditCard, LocationOn } from '@mui/icons-material'
import { getCartItemsAPI, updateCartItemAPI, removeFromCartAPI, createOrderAPI } from '../services/allAPI'
import { toast } from 'react-toastify'
import SERVER_URL from '../services/serviceURL'
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api'

const libraries = ['places']

const Cart = () => {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    location: '',
    paymentMethod: 'Credit Card',
    phoneNumber: '',
    deliveryAddress: ''
  })
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [map, setMap] = useState(null)
  const [center, setCenter] = useState({ lat: 10.8505, lng: 76.2711 })
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [searchBox, setSearchBox] = useState(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState(null)

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          toast.info('Using default location');
        }
      );
    }
    return () => {
      if (map) {
        setMap(null);
      }
    };
  }, []);

  const onLoad = (map) => {
    setMap(map);
    setMapLoaded(true);
    setMapError(null);
  };

  const onError = (error) => {
    console.error('Error loading Google Maps:', error);
    setMapError('Failed to load Google Maps');
    toast.error('Failed to load Google Maps');
  };

  const onSearchBoxLoad = (searchBox) => {
    setSearchBox(searchBox);
  };

  const onPlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        if (place.geometry && place.geometry.location) {
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          setCenter(location);
          setSelectedLocation(place);
          setCustomerDetails(prev => ({
            ...prev,
            location: place.formatted_address
          }));
        }
      }
    }
  };

  const onMapClick = (event) => {
    try {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat: event.latLng.lat(), lng: event.latLng.lng() } },
        (results, status) => {
          if (status === 'OK' && results[0]) {
            setSelectedLocation(results[0]);
            setCenter({
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            });
            setCustomerDetails(prev => ({
              ...prev,
              location: results[0].formatted_address
            }));
          } else {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            setSelectedLocation({ geometry: { location: event.latLng } });
            setCenter({ lat, lng });
            setCustomerDetails(prev => ({
              ...prev,
              location: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
            }));
            toast.warning('Unable to get address. Using coordinates instead.');
          }
        }
      );
    } catch (error) {
      console.error('Geocoding error:', error);
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setSelectedLocation({ geometry: { location: event.latLng } });
      setCenter({ lat, lng });
      setCustomerDetails(prev => ({
        ...prev,
        location: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
      }));
      toast.warning('Unable to get address. Using coordinates instead.');
    }
  };

  const fetchCartItems = async () => {
    try {
      const result = await getCartItemsAPI()
      if (result.status === 200) {
        setCartItems(result.data)
      } else {
        toast.error('Failed to fetch cart items')
      }
    } catch (error) {
      console.error('Error fetching cart items:', error)
      toast.error('Error fetching cart items')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlaceOrder = async () => {
    try {
      if (!customerDetails.name.trim() || !customerDetails.location.trim() || !customerDetails.paymentMethod || !customerDetails.phoneNumber.trim() || !customerDetails.deliveryAddress.trim()) {
        toast.error('Please fill in all required fields')
        return
      }

      const orderData = {
        customerDetails: {
          name: customerDetails.name,
          location: customerDetails.location,
          paymentMethod: customerDetails.paymentMethod,
          phoneNumber: customerDetails.phoneNumber,
          deliveryAddress: customerDetails.deliveryAddress
        },
        items: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.price
        }))
      }

      const result = await createOrderAPI(orderData)
      if (result.status === 201) {
        toast.success('Order placed successfully')
        console.log(orderData);
        
        setShowCheckoutModal(false)
        setCartItems([])
        setCustomerDetails({ name: '', location: '', paymentMethod: 'Credit Card', phoneNumber: '', deliveryAddress: '' })
      } else {
        toast.error(result.data?.message || 'Failed to place order')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error('Error placing order')
    }
  }

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      // Optimistically update the UI
      setCartItems(prevItems =>
        prevItems.map(item =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      )

      // Make API call in the background
      const result = await updateCartItemAPI(itemId, { quantity: newQuantity })
      if (result.status === 200) {
        toast.success('Cart updated successfully')
      } else {
        // Revert changes if API call fails
        await fetchCartItems()
        toast.error(result.data?.message || 'Failed to update cart')
      }
    } catch (error) {
      console.error('Error updating cart:', error)
      // Revert changes if API call fails
      await fetchCartItems()
      toast.error('Error updating cart')
    }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      const result = await removeFromCartAPI(itemId)
      if (result.status === 200) {
        fetchCartItems()
        toast.success('Item removed from cart')
      } else {
        toast.error('Failed to remove item')
      }
    } catch (error) {
      console.error('Error removing item:', error)
      toast.error('Error removing item')
    }
  }

  return (
    <Container className="pt-0 pb-5">
      <div className="d-flex align-items-center mb-4">
        <ShoppingCart sx={{ fontSize: 30 }} className="text-white me-2" />
        <h2 className="text-white mb-0">My Orders</h2>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center text-white-50 py-5">
          <ShoppingCart sx={{ fontSize: 60 }} className="mb-3" />
          <h4>Your cart is empty</h4>
          <Button variant="outline-light" href="/products" className="mt-3">
            Continue Shopping
          </Button>
        </div>
      ) : (
        <Row>
          <Col md={8}>
            {cartItems.map(item => (
              <Card key={item._id} className="mb-3 bg-dark text-white border-light">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col xs={3} sm={2}>
                      <img
                        src={`${SERVER_URL}/uploads/${item.product.image}?${Date.now()}`}
                        onError={(e) => {
                          console.error('Image failed to load:', e);
                          e.target.src = '/placeholder-image.png';
                        }}
                        alt={item.product.name}
                        className="img-fluid rounded"
                      />
                    </Col>
                    <Col xs={9} sm={10}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="mb-0">{item.product.name}</h5>
                        <Button
                          variant="link"
                          className="text-danger p-0"
                          onClick={() => handleRemoveItem(item._id)}
                        >
                          <Delete />
                        </Button>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <small className="text-muted">Price: ₹{item.price}</small>
                          <div className="mt-2">
                            <Button
                              variant="outline-light"
                              size="sm"
                              onClick={() => handleQuantityChange(item._id, Math.max(1, item.quantity - 1))}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </Button>
                            <span className="mx-2">{item.quantity}</span>
                            <Button
                              variant="outline-light"
                              size="sm"
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        <h5 className="mb-0">₹{item.price * item.quantity}</h5>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </Col>
          <Col md={4}>
            <Card className="bg-dark text-white border-light">
              <Card.Body>
                <h5 className="mb-3">Order Summary</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>₹{cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
                <hr className="border-light" />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total</strong>
                  <strong>₹{cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)}</strong>
                </div>
                <Button
                  variant="light"
                  className="w-100"
                  onClick={() => setShowCheckoutModal(true)}
                >
                  <Payment className="me-2" />
                  Proceed to Checkout
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Modal
        show={showCheckoutModal}
        onHide={() => setShowCheckoutModal(false)}
        centered
        className="text-white"
      >
        <Modal.Header closeButton className="bg-dark border-light">
          <Modal.Title>Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={customerDetails.name}
                onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                className="contact-input text-white"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter your phone number"
                value={customerDetails.phoneNumber}
                onChange={(e) => setCustomerDetails(prev => ({ ...prev, phoneNumber: e.target.value }))}
                className="contact-input text-white"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Delivery Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Enter your delivery address"
                value={customerDetails.deliveryAddress}
                onChange={(e) => setCustomerDetails(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                className="contact-input text-white"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <div className="mb-2">
                <LoadScript
                  googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                  libraries={libraries}
                >
                  <StandaloneSearchBox
                    onLoad={onSearchBoxLoad}
                    onPlacesChanged={onPlacesChanged}
                  >
                    <Form.Control
                      type="text"
                      placeholder="Search for a location"
                      value={customerDetails.location}
                      onChange={(e) => setCustomerDetails(prev => ({ ...prev, location: e.target.value }))}
                      className="contact-input text-white"
                    />
                  </StandaloneSearchBox>

                  <div style={{ height: '200px', marginTop: '10px' }}>
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      center={center}
                      zoom={13}
                      onLoad={onLoad}
                      onClick={onMapClick}
                    >
                      {selectedLocation && (
                        <Marker
                          position={{
                            lat: selectedLocation.geometry?.location.lat() || center.lat,
                            lng: selectedLocation.geometry?.location.lng() || center.lng
                          }}
                        />
                      )}
                    </GoogleMap>
                  </div>
                </LoadScript>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Payment Method</Form.Label>
              <div className="d-flex gap-3">
                <Button
                  variant={customerDetails.paymentMethod === 'Credit Card' ? 'light' : 'outline-light'}
                  className="w-50"
                  onClick={() => setCustomerDetails(prev => ({ ...prev, paymentMethod: 'Credit Card' }))}
                >
                  <CreditCard className="me-2" />
                  Credit Card
                </Button>
                <Button
                  variant={customerDetails.paymentMethod === 'Cash on Delivery' ? 'light' : 'outline-light'}
                  className="w-50"
                  onClick={() => setCustomerDetails(prev => ({ ...prev, paymentMethod: 'Cash on Delivery' }))}
                >
                  <LocationOn className="me-2" />
                  Cash on Delivery
                </Button>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-dark border-light">
          <Button variant="outline-light" onClick={() => setShowCheckoutModal(false)}>
            Cancel
          </Button>
          <Button variant="light" onClick={handlePlaceOrder}>
            Place Order
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Cart