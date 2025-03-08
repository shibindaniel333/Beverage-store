import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Dashboard } from '@mui/icons-material';
import DashboardOverview from './DashboardOverview';
import ProductsManagement from './ProductsManagement';
import UsersManagement from './UsersManagement';
import GraphManagement from './GraphManagement';
import MessagesManagement from './MessagesManagement';
import { getDashboardStatsAPI, getRecentOrdersAPI, getAllProductsAPI, getAllUsersAPI } from '../services/allAPI';
import { toast } from 'react-toastify';
import SERVER_URL from '../services/serviceURL';


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(null);
  const [editProductId, setEditProductId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for dashboard data
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch dashboard stats
        const statsResult = await getDashboardStatsAPI();
        if (statsResult.status === 200) {
          setStats(statsResult.data);
        } else {
          console.error('Failed to fetch dashboard stats:', statsResult);
          toast.error('Failed to fetch dashboard statistics');
        }
        
        // Fetch recent orders
        const ordersResult = await getRecentOrdersAPI();
        if (ordersResult.status === 200) {
          setRecentOrders(ordersResult.data);
        } else {
          console.error('Failed to fetch recent orders:', ordersResult);
          toast.error('Failed to fetch recent orders');
        }
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
        toast.error('Error loading dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Fetch products when products tab is active
  useEffect(() => {
    if (activeTab === 'products') {
      const fetchProducts = async () => {
        try {
          const result = await getAllProductsAPI();
          if (result.status === 200) {
            setProducts(result.data);
          } else {
            toast.error('Failed to fetch products');
          }
        } catch (error) {
          console.error('Error fetching products:', error);
          toast.error('Error fetching products');
        }
      };
      
      fetchProducts();
    }
  }, [activeTab]);
  
  // Fetch users when users tab is active
  useEffect(() => {
    if (activeTab === 'users') {
      const fetchUsers = async () => {
        try {
          const result = await getAllUsersAPI();
          if (result.status === 200) {
            setUsers(result.data);
          } else {
            toast.error('Failed to fetch users');
          }
        } catch (error) {
          console.error('Error fetching users:', error);
          toast.error('Error fetching users');
        }
      };
      
      fetchUsers();
    }
  }, [activeTab]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditProduct = (product) => {
    setEditProductId(product.id);
    setSelectedImage(product.image);
  };

  return (
    <Container className="pt-0 pb-5">
      <div className="d-flex align-items-center mb-4">
        <Dashboard sx={{ fontSize: 30 }} className="text-white me-2" />
        <h2 className="text-white mb-0">Admin Dashboard</h2>
      </div>

      <div className="mb-4">
        <Button
          variant={activeTab === 'overview' ? 'primary' : 'outline-light'}
          className="me-2"
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </Button>
        <Button
          variant={activeTab === 'products' ? 'primary' : 'outline-light'}
          className="me-2"
          onClick={() => setActiveTab('products')}
        >
          Products
        </Button>
        <Button
          variant={activeTab === 'users' ? 'primary' : 'outline-light'}
          className="me-2"
          onClick={() => setActiveTab('users')}
        >
          Users
        </Button>
        <Button
          variant={activeTab === 'analytics' ? 'primary' : 'outline-light'}
          className="me-2"
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </Button>
        <Button
          variant={activeTab === 'messages' ? 'primary' : 'outline-light'}
          onClick={() => setActiveTab('messages')}
        >
          Messages
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-5 text-white">
          <h4>{error}</h4>
          <Button variant="outline-light" onClick={() => window.location.reload()}>Retry</Button>
        </div>
      ) : (
        <>
          {activeTab === 'overview' && <DashboardOverview stats={stats} recentOrders={recentOrders} />}
          {activeTab === 'products' && <ProductsManagement />}
          {activeTab === 'users' && <UsersManagement />}
          {activeTab === 'analytics' && <GraphManagement />}
          {activeTab === 'messages' && <MessagesManagement />}
        </>
      )}
    </Container>
  );
};

export default AdminDashboard;