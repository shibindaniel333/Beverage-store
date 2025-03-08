import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Collapse } from 'react-bootstrap';
import { ShoppingBag, KeyboardArrowDown, KeyboardArrowUp, LocalShipping } from '@mui/icons-material';
import { getOrderHistoryAPI } from '../services/allAPI';
import { toast } from 'react-toastify';
import SERVER_URL from '../services/serviceURL';



const OrderHistory = () => {
  const [expandedOrder, setExpandedOrder] = useState(null);

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getOrderHistoryAPI();
      if (result.status === 200) {
        setOrders(result.data);
      } else {
        setError('Failed to fetch order history');
        toast.error('Failed to fetch order history');
      }
    } catch (error) {
      console.error('Error fetching order history:', error);
      setError('Error fetching order history');
      toast.error('Error fetching order history');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Delivered': 'success',
      'Processing': 'warning',
      'Cancelled': 'danger',
      'Shipped': 'info'
    };
    return <Badge bg={statusStyles[status] || 'secondary'}>{status}</Badge>;
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(orderId === expandedOrder ? null : orderId);
  };

  return (
    <Container className="pt-0 pb-5">
      <div className="d-flex align-items-center mb-4">
        <ShoppingBag sx={{ fontSize: 30 }} className="text-white me-2" />
        <h2 className="text-white mb-0">Order History</h2>
      </div>

      {orders.length === 0 ? (
        <Card 
          className="text-center p-5" 
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <Card.Body>
            <ShoppingBag sx={{ fontSize: 60 }} className="text-white-50 mb-3" />
            <h4 className="text-white">No orders found</h4>
            <p className="text-white-50">You haven't placed any orders yet.</p>
            <Button variant="outline-light" href="/products">Start Shopping</Button>
          </Card.Body>
        </Card>
      ) : (
        <div className="table-responsive">
          <Table 
            hover 
            className="align-middle table-dark rounded " 
            style={{ 
              color: 'white',
              backgroundColor: 'transparent',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}
          >
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Items</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <React.Fragment key={order._id}>
                  <tr>
                    <td>#{index + 1}</td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>${order.totalAmount.toFixed(2)}</td>
                    <td>{order.items.length} items</td>
                    <td>
                      <Button
                        variant="outline-light"
                        size="sm"
                        onClick={() => toggleOrderDetails(order._id)}
                        aria-expanded={expandedOrder === order._id}
                      >
                        {expandedOrder === order._id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        Details
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="6" className="p-0">
                      <Collapse in={expandedOrder === order._id}>
                        <div>
                          <Card 
                            style={{ 
                              backgroundColor: 'transparent',
                              border: 'none'
                            }}
                          >
                            <Card.Body>
                              <h6 className="text-white mb-3">Order Details</h6>
                              <Table 
                                size="sm" 
                                className="mb-0 table-dark" 
                                style={{ color: 'white' }}
                              >
                                <thead>
                                  <tr>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Subtotal</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.items.map((item, index) => (
                                    <tr key={index}>
                                      <td>{item.product?.name || 'Product Unavailable'}</td>
                                      <td>{item.quantity}</td>
                                      <td>${item.price.toFixed(2)}</td>
                                      <td>${(item.quantity * item.price).toFixed(2)}</td>
                                    </tr>
                                  ))}
                                  <tr>
                                    <td colSpan="3" className="text-end fw-bold">Total:</td>
                                    <td className="fw-bold">${order.totalAmount.toFixed(2)}</td>
                                  </tr>
                                </tbody>
                              </Table>
                              {order.status === 'Delivered' && (
                                <div className="mt-3 text-success d-flex align-items-center">
                                  <LocalShipping sx={{ fontSize: 20 }} className="me-2" />
                                  Delivered on {new Date(order.orderDate).toLocaleDateString()}
                                </div>
                              )}
                            </Card.Body>
                          </Card>
                        </div>
                      </Collapse>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default OrderHistory;