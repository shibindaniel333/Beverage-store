import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Dropdown, Badge, Collapse } from 'react-bootstrap';
import { 
  ShoppingCart,
  TrendingUp,
  Inventory,
  People,
  KeyboardArrowDown,
  KeyboardArrowUp
} from '@mui/icons-material';
import { updateOrderStatusAPI, getRecentOrdersAPI } from '../services/allAPI';
import { toast } from 'react-toastify';
import SERVER_URL from '../services/serviceURL';
import useImg from '../assets/userimage.png'

const DashboardOverview = ({ stats, recentOrders }) => {
  const [orders, setOrders] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  
  useEffect(() => {
    if (recentOrders && recentOrders.length > 0) {
      // Transform the API data to match the expected format
      const formattedOrders = recentOrders.map(order => ({
        id: order._id,
        customer: order.user ? order.user.username || order.user.email : 'Guest',
        user: order.user,
        date: new Date(order.orderDate).toLocaleDateString(),
        total: order.totalAmount,
        status: order.status,
        items: order.items
      }));
      setOrders(formattedOrders);
    }
  }, [recentOrders]);

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Delivered': 'success',
      'Processing': 'warning',
      'Cancelled': 'danger',
      'Pending': 'info',
      'Shipped': 'primary'
    };
    return <Badge bg={statusStyles[status] || 'secondary'}>{status}</Badge>;
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setIsUpdating(true);
      
      // Call the API to update the order status
      const result = await updateOrderStatusAPI(orderId, { status: newStatus });
      
      if (result.status === 200) {
        // Update the local state to reflect the change
        const updatedOrders = orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
        toast.success(`Order status updated to ${newStatus}`);
        
        // Refresh the recent orders list
        refreshRecentOrders();
      } else {
        toast.error(result.data?.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Error updating order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const refreshRecentOrders = async () => {
    try {
      const result = await getRecentOrdersAPI();
      if (result.status === 200) {
        const formattedOrders = result.data.map(order => ({
          id: order._id,
          customer: order.user ? order.user.username || order.user.email : 'Guest',
          date: new Date(order.orderDate).toLocaleDateString(),
          total: order.totalAmount,
          status: order.status
        }));
        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error('Error refreshing recent orders:', error);
    }
  };

  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <>
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)', border: '1px solid rgba(33, 150, 243, 0.2)' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-primary mb-1">Total Orders</p>
                  <h3 className="text-white mb-0">{stats.totalOrders}</h3>
                </div>
                <ShoppingCart sx={{ color: '#2196F3', fontSize: 40 }} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', border: '1px solid rgba(76, 175, 80, 0.2)' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-success mb-1">Total Revenue</p>
                  <h3 className="text-white mb-0">${stats.totalRevenue.toFixed(2)}</h3>
                </div>
                <TrendingUp sx={{ color: '#4CAF50', fontSize: 40 }} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card style={{ backgroundColor: 'rgba(255, 152, 0, 0.1)', border: '1px solid rgba(255, 152, 0, 0.2)' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-warning mb-1">Total Products</p>
                  <h3 className="text-white mb-0">{stats.totalProducts}</h3>
                </div>
                <Inventory sx={{ color: '#FF9800', fontSize: 40 }} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card style={{ backgroundColor: 'rgba(233, 30, 99, 0.1)', border: '1px solid rgba(233, 30, 99, 0.2)' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-danger mb-1">Total Users</p>
                  <h3 className="text-white mb-0">{stats.totalUsers}</h3>
                </div>
                <People sx={{ color: '#E91E63', fontSize: 40 }} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Card.Body>
          <h5 className="text-white mb-3">Recent Orders</h5>
          <Table hover className="table-dark text-center" style={{ backgroundColor: 'transparent', borderColor: 'rgba(255, 255, 255, 0.1)', width: '100%', padding: 0, margin: 0 }}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? orders.map((order,i) => (
                <><tr key={order.id}>
                  <td onClick={() => toggleOrderDetails(order.id)} style={{ cursor: 'pointer' }}>
                    #{order.id.substring(0, 8)}
                    {expandedOrder === order.id ? <KeyboardArrowUp className="ms-2" /> : <KeyboardArrowDown className="ms-2" />}
                  </td>
                  <td className="d-flex align-items-center justify-content-center flex-column gap-2">
                    <img
                      src={order.user?.profilePic ? `${SERVER_URL}/uploads/${order.user.profilePic}` : useImg}
                      alt={order.customer}
                      onError={(e) => { e.target.onerror = null; e.target.src = useImg; }}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }} />
                    <span>{order.customer}</span>
                  </td>
                  <td>{order.date}</td>
                  <td>${order.total ? order.total.toFixed(2) : '0.00'}</td>
                  <td className="text-center">
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="outline-light"
                        size="sm"
                        disabled={isUpdating}
                        style={{
                          backgroundColor: order.status === 'Processing' ? 'rgba(255, 193, 7, 0.2)' :
                            order.status === 'Delivered' ? 'rgba(40, 167, 69, 0.2)' :
                              order.status === 'Cancelled' ? 'rgba(220, 53, 69, 0.2)' :
                                order.status === 'Shipped' ? 'rgba(13, 110, 253, 0.2)' :
                                  order.status === 'Pending' ? 'rgba(23, 162, 184, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          width: '140px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          margin: '0 auto'
                        }}
                      >
                        {getStatusBadge(order.status)}
                      </Dropdown.Toggle>
                      <Dropdown.Menu variant="dark">
                        <Dropdown.Item
                          onClick={() => handleStatusUpdate(order.id, 'Pending')}
                          active={order.status === 'Pending'}
                        >
                          Pending
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleStatusUpdate(order.id, 'Processing')}
                          active={order.status === 'Processing'}
                        >
                          Processing
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleStatusUpdate(order.id, 'Shipped')}
                          active={order.status === 'Shipped'}
                        >
                          Shipped
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleStatusUpdate(order.id, 'Delivered')}
                          active={order.status === 'Delivered'}
                        >
                          Delivered
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleStatusUpdate(order.id, 'Cancelled')}
                          active={order.status === 'Cancelled'}
                        >
                          Cancelled
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr><tr>
                    <td colSpan="5" className="p-0">
                      <Collapse in={expandedOrder === order.id}>
                        <div className="p-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                          <h6 className="text-white mb-3">Order Items</h6>
                          <div className="table-responsive">
                            <Table size="sm" className="table-dark mb-0">
                              <thead>
                                <tr>
                                  <th>Image</th>
                                  <th>Item</th>
                                  <th>Quantity</th>
                                  <th>Price</th>
                                  <th>Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.items?.map((item, index) => (
                                  <tr key={index}>
                                    <td>
                                      <img
                                        src={`${SERVER_URL}/uploads/${item.product?.image}`}
                                        alt={item.product?.name}
                                        style={{
                                          width: '40px',
                                          height: '40px',
                                          objectFit: 'contain'
                                        }} />
                                    </td>
                                    <td>{item.product?.name || 'Product Unavailable'}</td>
                                    <td>{item.quantity}</td>
                                    <td>${item.price?.toFixed(2)}</td>
                                    <td>${(item.quantity * item.price)?.toFixed(2)}</td>
                                  </tr>
                                ))}
                                <tr>
                                  <td colSpan="4" className="text-end fw-bold">Total:</td>
                                  <td className="fw-bold">${order.total?.toFixed(2)}</td>
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                        </div>
                      </Collapse>
                    </td>
                  </tr></>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center">No recent orders found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};

export default DashboardOverview;