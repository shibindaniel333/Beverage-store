import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LocalDrink, LocalBar, Coffee, EmojiFoodBeverage, 
         LocalCafe, SportsBar, Opacity, Whatshot, WineBar } from '@mui/icons-material';

const Categories = () => {
  const categories = [
    { id: 1, name: 'Soft Drinks', icon: <LocalDrink sx={{ fontSize: 40 }}/>, color: '#FF6B6B' },
    { id: 2, name: 'Energy Drinks', icon: <Whatshot sx={{ fontSize: 40 }}/>, color: '#4ECDC4' },
    { id: 3, name: 'Coffee', icon: <Coffee sx={{ fontSize: 40 }}/>, color: '#45B7D1' },
    { id: 4, name: 'Tea', icon: <EmojiFoodBeverage sx={{ fontSize: 40 }}/>, color: '#96CEB4' },
    { id: 5, name: 'Smoothies', icon: <LocalCafe sx={{ fontSize: 40 }}/>, color: '#FF9F9F' },
    { id: 6, name: 'Mocktails', icon: <LocalBar sx={{ fontSize: 40 }}/>, color: '#D4A5A5' },
    { id: 7, name: 'Water', icon: <Opacity sx={{ fontSize: 40 }}/>, color: '#9ED2C6' },
    { id: 8, name: 'Sports Drinks', icon: <SportsBar sx={{ fontSize: 40 }}/>, color: '#FFB6B9' },
    { id: 9, name: 'Wine', icon: <WineBar sx={{ fontSize: 40 }}/>, color: '#B23A48' }
  ];

  return (
    <Container className="pt-0 pb-5">  {/* Changed from py-5 to pt-0 pb-5 */}
      <h2 className="text-center text-white mb-5">Browse Categories</h2>
      <Row xs={1} md={2} lg={4} className="g-4">
        {categories.map(category => (
          <Col key={category.id}>
            <Link to={`/products?category=${category.name.toLowerCase()}`} style={{ textDecoration: 'none' }}>
              <Card 
                className="h-100 text-center category-card" 
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                  <div 
                    className="icon-wrapper mb-3" 
                    style={{
                      backgroundColor: `${category.color}33`,
                      color: category.color,
                      padding: '20px',
                      borderRadius: '50%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {category.icon}
                  </div>
                  <Card.Title className="text-white mb-0">{category.name}</Card.Title>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Categories;