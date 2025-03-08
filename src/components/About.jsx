import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { LocalBar, Verified, LocalShipping, Support } from '@mui/icons-material';

// Import images
import aboutusBlue from '../assets/aboutusblue.png';
import aboutusRed from '../assets/aboutusred.png';
import aboutusGreen from '../assets/aboutusgreen.png';
import aboutusGrey from '../assets/aboutussky.png';
import aboutusYellow from '../assets/aboutusyellow.png';
import aboutusOrange from '../assets/aboutusorange.png';
import aboutusCoffee from '../assets/aboutusbrown.png';

const About = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const aboutImages = [
    aboutusBlue,
    aboutusRed,
    aboutusGreen,
    aboutusGrey,
    aboutusYellow,
    aboutusOrange,
    aboutusCoffee
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === aboutImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: <LocalBar sx={{ fontSize: 40 }} />, title: "Premium Selection", description: "We carefully curate our beverage collection to bring you the finest drinks from around the world." },
    { icon: <Verified sx={{ fontSize: 40 }} />, title: "Quality Guaranteed", description: "Every product in our store meets strict quality standards and freshness requirements." },
    { icon: <LocalShipping sx={{ fontSize: 40 }} />, title: "Fast Delivery", description: "We ensure quick and safe delivery of your favorite beverages right to your doorstep." },
    { icon: <Support sx={{ fontSize: 40 }} />, title: "24/7 Support", description: "Our dedicated customer service team is always ready to assist you with any queries." }
  ];

  return (
    <Container className="pt-0 pb-5">
      <Row className="mb-5 align-items-center">
        <Col md={4} className="mb-4 mb-md-0">
          <h2 className="text-white mb-4">Our Story</h2>
          <div className="text-white-50">
            <p>Welcome to Beverage Store, your premier destination for refreshing drinks and beverages. Since our establishment in 2020, we've been passionate about bringing the finest selection of drinks to our customers.</p>
          </div>
        </Col>
        
        <Col md={4}>
          <div className="about-image rounded mx-auto position-relative" style={{ height: '400px', width: '300px', marginBottom: '20px', overflow: 'hidden' }}>
            {aboutImages.map((image, index) => (
              <div
                key={index}
                className="position-absolute w-100 h-100"
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '1px solid rgba(255,255,255,0.2)',
                  opacity: currentImageIndex === index ? 1 : 0,
                  transition: 'opacity 1s ease-in-out'
                }}
              />
            ))}
          </div>
        </Col>
        
        <Col md={4}>
          <div className="text-white-50">
            <p>What started as a small local store has grown into a trusted online beverage retailer, serving thousands of satisfied customers across the region.</p>
            <p>Our mission is to provide exceptional quality beverages while ensuring a seamless shopping experience for our valued customers.</p>
          </div>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col xs={12}>
          <h3 className="text-white text-center mb-4">Why Choose Us</h3>
        </Col>
        {features.map((feature, index) => (
          <Col md={3} key={index} className="mb-4">
            <div className="text-center p-4 h-100" style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', transition: 'transform 0.3s ease' }}>
              <div className="text-primary mb-3">{feature.icon}</div>
              <h5 className="text-white mb-3">{feature.title}</h5>
              <p className="text-white-50 mb-0">{feature.description}</p>
            </div>
          </Col>
        ))}
      </Row>

      <Row className="text-center">
        <Col md={3} className="mb-4 mb-md-0"><h2 className="text-primary mb-2">1000+</h2><p className="text-white">Products</p></Col>
        <Col md={3} className="mb-4 mb-md-0"><h2 className="text-primary mb-2">5000+</h2><p className="text-white">Happy Customers</p></Col>
        <Col md={3} className="mb-4 mb-md-0"><h2 className="text-primary mb-2">50+</h2><p className="text-white">Brands</p></Col>
        <Col md={3}><h2 className="text-primary mb-2">24/7</h2><p className="text-white">Support</p></Col>
      </Row>
    </Container>
  );
};

export default About;
