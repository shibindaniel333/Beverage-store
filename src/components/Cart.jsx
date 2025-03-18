import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap'
import { ShoppingCart, Delete, Payment, CreditCard } from '@mui/icons-material'
import { getCartItemsAPI, updateCartItemAPI, removeFromCartAPI, createOrderAPI } from '../services/allAPI'
import { toast } from 'react-toastify'
import SERVER_URL from '../services/serviceURL'


const Cart = () => {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    location: '',
    paymentMethod: 'Credit Card'
  })
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCartItems()
  }, [])

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
      // Validate customer details
      if (!customerDetails.name.trim() || !customerDetails.location.trim() || !customerDetails.paymentMethod) {
        toast.error('Please fill in all required fields')
        return
      }

      // Create order payload
      const orderData = {
        customerDetails: {
          name: customerDetails.name,
          location: customerDetails.location,
          paymentMethod: customerDetails.paymentMethod
        },
        items: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.price
        }))
      }

      // Create order
      const result = await createOrderAPI(orderData)
      if (result.status === 201) {
        toast.success('Order placed successfully')
        console.log(orderData);
        
        setShowCheckoutModal(false)
        setCartItems([])
        setCustomerDetails({ name: '', location: '', paymentMethod: 'Credit Card' })
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
              <Card 
                key={item.id} 
                className="mb-3" 
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <Card.Body>
                  <Row className="align-items-center">
                    <Col xs={3}>
                      <img 
                        src={`${SERVER_URL}/uploads/${item.product.image}`}
                        alt={item.product.name}
                        style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                      />
                    </Col>
                    <Col xs={6}>
                      <h5 className="text-white mb-2">{item.product.name}</h5>
                      <p className="text-white-50 mb-0">${item.price.toFixed(2)} x {item.quantity}</p>
                    </Col>
                    <Col xs={3} className="text-end">
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        className="mb-2"
                        onClick={() => handleRemoveItem(item._id)}
                      >
                        <Delete />
                      </Button>
                      <div className="d-flex justify-content-end align-items-center gap-2">
                        <Button 
                          variant="outline-light" 
                          size="sm"
                          onClick={() => handleQuantityChange(item._id, Math.max(1, item.quantity - 1))}
                        >-</Button>
                        <span className="text-white">{item.quantity}</span>
                        <Button 
                          variant="outline-light" 
                          size="sm"
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        >+</Button>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </Col>
          <Col md={4}>
            <Card 
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <Card.Body>
                <h4 className="text-white mb-4">Order Summary</h4>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-white-50">Total Items</span>
                  <span className="text-white">{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-white-50">Subtotal</span>
                  <span className="text-white">${cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-white-50">Delivery</span>
                  <span className="text-white">Free</span>
                </div>
                <hr className="border-light" />
                <div className="d-flex justify-content-between mb-4">
                  <span className="text-white fw-bold">Total</span>
                  <span className="text-white fw-bold">${cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span>
                </div>
                <Button 
                  variant="outline-light" 
                  className="w-100"
                  onClick={() => setShowCheckoutModal(true)}
                >
                  Proceed to Checkout
                </Button>

                {/* Checkout Modal */}
                <Modal
                  show={showCheckoutModal}
                  onHide={() => setShowCheckoutModal(false)}
                  centered
                  size="md"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
                  contentClassName="bg-transparent"
                  dialogClassName="mt-5"
                >
                  <Modal.Header
                    closeButton
                    style={{
                      backgroundColor: 'rgba(33, 33, 33, 0.8)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <Modal.Title className="text-white h4 fw-bold">Complete Your Order</Modal.Title>
                  </Modal.Header>
                  <Modal.Body
                    style={{
                      backgroundColor: 'rgba(33, 33, 33, 0.8)',
                      color: 'white',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={customerDetails.name}
                          onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: 'white'
                          }}
                          placeholder="Enter your full name"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Delivery Address and phone number</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={customerDetails.location}
                          onChange={(e) => setCustomerDetails(prev => ({ ...prev, location: e.target.value }))}
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: 'white'
                          }}
                          placeholder="Enter your complete delivery address"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="d-flex align-items-center">
                          <Payment sx={{ fontSize: 20 }} className="me-2" />
                          Payment Method
                        </Form.Label>
                        <div className="mt-2">
                          <Form.Check
                            type="radio"
                            id="credit-card"
                            name="paymentMethod"
                            label="Credit Card"
                            value="Credit Card"
                            checked={customerDetails.paymentMethod === 'Credit Card'}
                            onChange={(e) => setCustomerDetails(prev => ({ ...prev, paymentMethod: e.target.value }))}
                            className="mb-2 text-white"
                          />
                          <Form.Check
                            type="radio"
                            id="debit-card"
                            name="paymentMethod"
                            label="Debit Card"
                            value="Debit Card"
                            checked={customerDetails.paymentMethod === 'Debit Card'}
                            onChange={(e) => setCustomerDetails(prev => ({ ...prev, paymentMethod: e.target.value }))}
                            className="mb-2 text-white"
                          />
                          <Form.Check
                            type="radio"
                            id="paypal"
                            name="paymentMethod"
                            label="PayPal"
                            value="PayPal"
                            checked={customerDetails.paymentMethod === 'PayPal'}
                            onChange={(e) => setCustomerDetails(prev => ({ ...prev, paymentMethod: e.target.value }))}
                            className="mb-2 text-white"
                          />
                          <Form.Check
                            type="radio"
                            id="cash-on-delivery"
                            name="paymentMethod"
                            label="Cash on Delivery"
                            value="Cash on Delivery"
                            checked={customerDetails.paymentMethod === 'Cash on Delivery'}
                            onChange={(e) => setCustomerDetails(prev => ({ ...prev, paymentMethod: e.target.value }))}
                            className="text-white"
                          />
                        </div>
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer
                    style={{
                      backgroundColor: 'rgba(33, 33, 33, 0.8)',
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <Button variant="outline-light" onClick={() => setShowCheckoutModal(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={handlePlaceOrder}>
                      Place Order
                    </Button>
                  </Modal.Footer>
                </Modal>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  )
}

export default Cart