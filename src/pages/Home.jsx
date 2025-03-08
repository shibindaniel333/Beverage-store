import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Carousel } from 'react-bootstrap'
import image1 from '../assets/wbg2.jpg'
import bg from '../assets/bg.png'
import bg1 from '../assets/bg1.png'
import bg3 from '../assets/car2.jpg'
import bg4 from '../assets/car9.jpg'
import bg5 from '../assets/crasouel1.jpg'
import bg6 from '../assets/wbg1.jpg'
import bg7 from '../assets/welcomebg.png'
import useImg from '../assets/userimage.png'
import 'animate.css';
import { getPreviewProductsAPI, getUserReviewsAPI } from '../services/allAPI';
import SERVER_URL from '../services/serviceURL'



const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userReviews, setUserReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await getPreviewProductsAPI();
        if (result.status === 200) {
          setFeaturedProducts(result.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserReviews = async () => {
      try {
        setReviewsLoading(true);
        const result = await getUserReviewsAPI();
        if (result.status === 200) {
          // Filter only approved reviews
          const approvedReviews = result.data.filter(review => review.status === 'approved');
          setUserReviews(approvedReviews);
        }
      } catch (error) {
        console.error('Error fetching user reviews:', error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchProducts();
    fetchUserReviews();
  }, []);
  return (
    <Container fluid className="p-0">  {/* Changed from pt-0 to p-0 */}
      <Row className="g-0">
        <Col>
          <Carousel interval={2000}>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={bg3}
                alt="First slide"
                style={{ height: '500px', objectFit: 'cover' }} 
              />
              <Carousel.Caption className="text-start px-3" style={{ top: '50%', transform: 'translateY(-50%)', bottom: 'auto' }}>
                <h3 className="fs-1 animate__animated animate__backInRight">Premium Beverages</h3>
                <p>Discover our exclusive collection of premium drinks</p>
                <Button variant="outline-light" href="/products" style={{ background: 'transparent', borderColor: 'white', transition: 'all 0.3s' }} className="shop-now-btn" sx={{ '&:hover': { backgroundColor: '#2196F3', color: 'white', borderColor: '#2196F3' } }}>Shop Now</Button>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={bg4}
                alt="Second slide"
                style={{ height: '500px', objectFit: 'cover' }}
              />
              <Carousel.Caption className="text-start  px-3" style={{ top: '50%', transform: 'translateY(-50%)', bottom: 'auto' }}>
                <h3 className="fs-1 animate__animated animate__backInRight">Refreshing Selection</h3>
                <p>Cool down with our refreshing drink options</p>
                <Button variant="outline-light" href="/products" style={{ background: 'transparent', borderColor: 'white', transition: 'all 0.3s' }} className="shop-now-btn" sx={{ '&:hover': { backgroundColor: '#2196F3', color: 'white', borderColor: '#2196F3' } }}>Shop Now</Button>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={bg5}
                alt="Third slide"
                style={{ height: '500px', objectFit: 'cover' }}
              />
              <Carousel.Caption className="text-start px-3" style={{ top: '50%', transform: 'translateY(-50%)', bottom: 'auto' }}>
                <h3 className="fs-1 animate__animated animate__backInRight">Seasonal Specials</h3>
                <p>Try our limited-time seasonal beverages</p>
                <Button variant="outline-light" href="/products" style={{ background: 'transparent', borderColor: 'white', transition: 'all 0.3s' }} className="shop-now-btn" sx={{ '&:hover': { backgroundColor: '#2196F3', color: 'white', borderColor: '#2196F3' } }}>Shop Now</Button>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={bg6}
                alt="Fourth slide"
                style={{ height: '500px', objectFit: 'cover' }}
              />
              <Carousel.Caption className="text-start px-3" style={{ top: '50%', transform: 'translateY(-50%)', bottom: 'auto' }}>
                <h3 className="fs-1 animate__animated animate__backInRight">Exclusive Deals</h3>
                <p>Great savings on your favorite drinks</p>
                <Button variant="outline-light" href="/products" style={{ background: 'transparent', borderColor: 'white', transition: 'all 0.3s' }} className="shop-now-btn" sx={{ '&:hover': { backgroundColor: '#2196F3', color: 'white', borderColor: '#2196F3' } }}>Shop Now</Button>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Col>
      </Row>
      <Container id='start' className="py-4">  {/* Reduced padding from py-5 */}
        <Row className="align-items-center">
          <Col xs={6}>
            <h1  className="display-4 animate__animated animate__bounce animate__infinite animate__delay-4s">Welcome to Beverage Store</h1>
            <p className="lead ">Discover our wide selection of refreshing drinks and beverages. <br /> we offer something for everyone  bubbly drink or a rich. <br /> Keep you hydrated in style.</p>
            <Button variant="outline-light" href="/products" style={{ background: 'transparent', borderColor: 'white', transition: 'all 0.3s' }} className="shop-now-btn" sx={{ '&:hover': { backgroundColor: '#2196F3', color: 'white', borderColor: '#2196F3' } }}>Shop Now</Button>
            </Col>
          <Col xs={6}>
            <img 
              src={bg7} 
              alt="Beverages" 
              className="img-fluid rounded shadow"
            />
          </Col>
        </Row>
      </Container>
            <Container id='start' className="py-5">
        <Row className="align-items-center">
          {/* ... existing welcome content ... */}
        </Row>
      </Container>
      {/* Hand Picked Collection Section */}
      <Container fluid className="py-5 my-5" style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '400px'
      }}>
        <Row>
          <Col md={6}></Col>
          <Col md={6} className="d-flex align-items-center justify-content-center">
            <div className="text-center text-white">
              <h3 className="display-3 mb-4">
                <span className='animate__animated animate__fadeInDown '>Hand Picked</span> 
                <br />
                <span style={{ fontFamily: 'Roboto' }} className='fs-1 fw-bolder animate__animated animate__fadeInUp animate__delay-1s'>collection</span>
              </h3>
              <p className="lead mb-4 animate__animated animate__fadeIn animate__delay-2s">
                Discover our carefully curated selection of premium beverages
              </p>
              <Button 
                variant="outline-light" 
                href="/products" 
                size="lg"
                style={{ 
                  backgroundImage: bg, 
                  borderColor: 'white', 
                  transition: 'all 0.3s',
                  padding: '0.8rem 2.5rem'
                }}
              >
                Shop Now
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
      {/* Featured Products Section */}
      <Container className="py-5">
        <h2 className="text-center mb-5 text-white">Featured Products</h2>
        {isLoading ? (
          <div className="text-center">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <Row className="flex-nowrap overflow-auto   rounded g-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {featuredProducts.map((product) => (
              <Col key={product._id} md={3} style={{ minWidth: '250px' }}>
                <div className="card h-100" style={{ backgroundColor: 'transparent',border:"none" }}>
                  <img 
                    src={`${SERVER_URL}/uploads/${product.image}`} 
                    className="card-img-top" 
                    alt={product.name} 
                    style={{ height: '180px', objectFit: 'contain' }} 
                  />
                  <div className="card-body text-white text-center d-flex flex-column align-items-center">
                    <h4 className="card-title">{product.name}</h4>
                    <h5 style={{"color":"rgb(56, 57, 58)"}} className="card-title">{product.category}</h5>
                    <p style={{"color":"rgb(32, 73, 38)"}} className="card-text  fw-bold">$ {product.price.toFixed(2)}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Container>
      {/* Customer Testimonials Section */}
      <Container fluid className="py-5" style={{
        backgroundImage: `url(${bg3})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '500px'
      }}>
        <h2 className="text-center text-white mb-5">Customer Reviews</h2>
        <Row className="justify-content-center">
          <Col md={6}>
            {reviewsLoading ? (
              <div className="text-center">
                <div className="spinner-border text-light" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : userReviews.length > 0 ? (
              <Carousel interval={3000} indicators={false} controls={false}>
                {userReviews.map((review, index) => (
                  <Carousel.Item key={index}>
                    <div className="text-center p-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '15px' }}>
                      <img
                        src={review.userId?.profilePic ? `${SERVER_URL}/uploads/${review.userId.profilePic}` : useImg}
                        alt={review.userId?.username || 'User'}
                        className="rounded-circle mb-3"
                        style={{ width: '100px', height: '100px', objectFit: 'cover', border: '3px solid white' }}
                      />
                      <div className="text-warning mb-2">
                        {'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)}
                      </div>
                      <p className="text-white mb-3">"{review.comment}"</p>
                      <h5 className="text-white mb-0">{review.userId?.username || 'Anonymous User'}</h5>
                      <small className="text-white-50">Verified Buyer</small>
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              <div className="text-center text-white">
                <p>No reviews available at the moment.</p>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </Container>
  )
}

export default Home