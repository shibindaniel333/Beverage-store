import React from 'react';
import { Container } from 'react-bootstrap';

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="d-none d-lg-flex align-items-center justify-content-center p-4" 
      style={{ 
        backgroundColor: 'transparent',
        minHeight: '600px',
        height: '100%'
      }}
    >
      <Container className="text-center">
        <div className="row row-cols-3 g-3 mb-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="col">
              <div
                className={`ratio ratio-1x1 rounded ${i % 2 === 0 ? 'animate__animated animate__pulse animate__infinite' : ''}`}
                style={{
                  backgroundColor: i % 2 === 0 ? 'rgba(79, 91, 95, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(12, 147, 196, 0.2)',
                  transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '12px',
                  '&:hover': {
                    backgroundColor: i % 2 === 0 ? 'rgba(0, 0, 0, 0.2)' : 'rgba(172, 0, 0, 0.2)'
                  }
                }}
              />
            </div>
          ))}
        </div>
        <h2 className="text-white fw-bold mb-3">{title}</h2>
        <p className="text-white-50">{subtitle}</p>
      </Container>
    </div>
  );
};

export default AuthImagePattern;