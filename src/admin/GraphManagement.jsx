import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, Rectangle ,Cell} from 'recharts';
import { Assessment } from '@mui/icons-material';
import { getMonthlyRevenueAPI, getCategorySalesAPI } from '../services/allAPI';

const GraphManagement = () => {
  const [salesData, setSalesData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Month names for mapping numeric months to names
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Add a refresh interval state to trigger data refresh
  const [refreshInterval, setRefreshInterval] = useState(0);

  // Function to manually refresh data
  const refreshData = () => {
    setRefreshInterval(prev => prev + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch monthly revenue data
        const revenueResult = await getMonthlyRevenueAPI();
        if (revenueResult.status === 200) {
          // Transform the data to match the chart format
          const formattedRevenueData = revenueResult.data.map(item => ({
            month: monthNames[item.month - 1],
            revenue: item.revenue
          }));
          setRevenueData(formattedRevenueData);
        } else {
          setError('Failed to fetch revenue data');
          console.error('Revenue data fetch error:', revenueResult);
        }

        // Fetch category sales data
        const categorySalesResult = await getCategorySalesAPI();
        if (categorySalesResult.status === 200) {
          // Transform the data to match the chart format
          const formattedSalesData = categorySalesResult.data.map(item => ({
            name: item.category,
            sales: item.count
          }));
          setSalesData(formattedSalesData);
        } else {
          setError('Failed to fetch category sales data');
          console.error('Category sales data fetch error:', categorySalesResult);
        }
      } catch (error) {
        setError('Error fetching analytics data');
        console.error('Analytics data fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      refreshData();
    }, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [refreshInterval]); // Add refreshInterval as a dependency to re-fetch when it changes

  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#E91E63', '#9C27B0'];

  const getPath = (x, y, width, height) => {
    return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
    ${x + width / 2}, ${y}
    C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
    Z`;
  };

  const CustomBar = (props) => {
    const { fill, x, y, width, height } = props;
    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: 'rgba(33, 33, 33, 0.95)', 
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '10px',
          borderRadius: '4px',
          color: 'white'
        }}>
          <p className="label">{`${label} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <Card.Body>
        <div className="d-flex align-items-center mb-4">
          <Assessment sx={{ fontSize: 30 }} className="text-white me-2" />
          <h5 className="text-white mb-0">Analytics Dashboard</h5>
        </div>
        
        {isLoading ? (
          <div className="d-flex justify-content-center my-5">
            <Spinner animation="border" variant="light" />
            <span className="ms-2 text-white">Loading analytics data...</span>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (

        <Row className="g-4">
          <Col xs={12} md={6}>
            <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Card.Body>
                <h6 className="text-white mb-3">Sales by Category</h6>
                <div style={{ width: '100%', height: 300, overflow: 'hidden' }}>
                  <BarChart
                    width={window.innerWidth < 768 ? 350 : 500}
                    height={300}
                    data={salesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="#fff" angle={-45} textAnchor="end" height={60} />
                    <YAxis stroke="#fff" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      wrapperStyle={{ color: '#fff' }} 
                      verticalAlign="bottom"
                      align="left"
                    />
                    <Bar dataKey="sales" fill="#8884d8" shape={<CustomBar />} label={{ position: 'top' }}>
                      {salesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col xs={12} md={6}>
            <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Card.Body>
                <h6 className="text-white mb-3">Monthly Revenue</h6>
                <div style={{ width: '100%', height: 300, overflow: 'hidden' }}>
                  <LineChart
                    width={window.innerWidth < 768 ? 350 : 500}
                    height={300}
                    data={revenueData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      wrapperStyle={{ color: '#fff' }} 
                      verticalAlign="bottom"
                      align="left"
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
                  </LineChart>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        )}
      </Card.Body>
    </Card>
  );
};

export default GraphManagement;