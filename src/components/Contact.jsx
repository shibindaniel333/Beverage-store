import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Phone, Email, LocationOn, AccessTime, Facebook, Instagram, Twitter, LinkedIn } from '@mui/icons-material';

const Contact = () => {
  const contactInfo = [
    {
      icon: <Phone sx={{ fontSize: 40 }}/>,
      title: "Call Us",
      details: [
        "Customer Service: +1 (555) 123-4567",
        "Orders & Support: +1 (555) 987-6543",
        "Available 24/7"
      ]
    },
    {
      icon: <Email sx={{ fontSize: 40 }}/>,
      title: "Email Us",
      details: [
        "General Inquiries: shibindaniel@beveragestore.com",
        "Support: support@beveragestore.com",
        "Orders: orders@beveragestore.com"
      ]
    },
    {
      icon: <LocationOn sx={{ fontSize: 40 }}/>,
      title: "Visit Us",
      details: [
        "Kerala",
        "Thrissur, Chalakudy",
        "Elnijipra 680-721"
      ]
    },
    {
      icon: <AccessTime sx={{ fontSize: 40 }}/>,
      title: "Opening Hours",
      details: [
        "Monday - Friday: 9:00 AM - 8:00 PM",
        "Saturday: 10:00 AM - 6:00 PM",
        "Sunday: 11:00 AM - 5:00 PM"
      ]
    }
  ];

  const socialLinks = [
    { icon: <Facebook />, link: "#", color: "#1877f2" },
    { icon: <Instagram />, link: "#", color: "#e4405f" },
    { icon: <Twitter />, link: "#", color: "#1da1f2" },
    { icon: <LinkedIn />, link: "#", color: "#0077b5" }
  ];

  const faqItems = [
    {
      question: "How do I track my order?",
      answer: "Once your order is shipped, you'll receive a tracking number via email. You can use this number to track your package through our shipping partners' websites."
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns within 30 days of purchase. Items must be unopened and in their original packaging. Please contact our customer service for return authorization."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to select international destinations. Shipping costs and delivery times vary by location. Please check our shipping page for more details."
    },
    {
      question: "How can I change or cancel my order?",
      answer: "Orders can be modified or cancelled within 2 hours of placement. Please contact our customer service team immediately with your order number."
    }
  ];

  return (
    <Container className="pt-0 pb-5">
      <h2 className="text-white text-center mb-2">Contact Us</h2>
      <p className="text-white-50 text-center mb-5">Get in touch with us through our contact information or find answers to common questions below.</p>
      
      <Row className="g-4 mb-5">
        {contactInfo.map((info, index) => (
          <Col md={3} key={index}>
            <div 
              className="text-center p-4 h-100 contact-card" 
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease'
              }}
            >
              <div className="text-primary mb-3">
                {info.icon}
              </div>
              <h5 className="text-white mb-3">{info.title}</h5>
              {info.details.map((detail, idx) => (
                <p key={idx} className="text-white-50 mb-1 small">{detail}</p>
              ))}
            </div>
          </Col>
        ))}
      </Row>

      <Row className="justify-content-center">
        <Col md={8}>
          <div 
            className="p-4"
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <h3 className="text-white text-center mb-4">Frequently Asked Questions</h3>
            {faqItems.map((item, index) => (
              <div 
                key={index} 
                className="mb-4"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}
              >
                <h5 className="text-white mb-3">{item.question}</h5>
                <p className="text-white-50 mb-0">{item.answer}</p>
              </div>
            ))}
          </div>
        </Col>
      </Row>

      <Row className="justify-content-center mt-5">
        <Col md={8} className="text-center">
          <h5 className="text-white mb-3">Connect With Us</h5>
          <div className="d-flex justify-content-center gap-3">
            {socialLinks.map((social, index) => (
              <a 
                key={index} 
                href={social.link}
                className="social-link"
                style={{ 
                  color: social.color,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  padding: '10px',
                  borderRadius: '50%',
                  display: 'inline-flex',
                  transition: 'all 0.3s ease'
                }}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;