import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';
import { Star, StarBorder, StarHalf, Feedback, QuestionAnswer, Support } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { createReviewAPI, getUserReviewsAPI } from '../services/allAPI';
import SERVER_URL from '../services/serviceURL';


const SpecialOffers = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const token = localStorage.getItem('token');

  const [newFeedback, setNewFeedback] = useState({
    type: 'feedback',
    rating: 0,
    comment: ''
  });

  useEffect(() => {
    fetchUserReviews();
  }, []);

  const fetchUserReviews = async () => {
    try {
      const response = await getUserReviewsAPI();
      if (response.status === 200) {
        // Transform the feedback data to include proper user information from userId
        const transformedFeedbacks = response.data.map(feedback => ({
          ...feedback,
          user: feedback.userId ? {
            username: feedback.userId.username,
            profilePic: feedback.userId.profilePic ? `${SERVER_URL}/uploads/${feedback.userId.profilePic}` : '/src/assets/userimage.png'
          } : {
            username: 'Anonymous',
            profilePic: '/src/assets/userimage.png'
          }
        }));
        setFeedbacks(transformedFeedbacks);
      } else {
        toast.error(response.data?.message || 'Error fetching reviews');
    } }catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (newFeedback.type === 'feedback' && !newFeedback.rating) {
      toast.error('Please provide a rating');
      return;
    }
    if (!newFeedback.comment.trim()) {
      toast.error('Please provide your feedback or question');
      return;
    }

    try {
      const response = await createReviewAPI(newFeedback);
      if (response.status === 201) {
        // Log the submitted feedback with user information
        console.log('New Feedback Submitted:', {
          type: newFeedback.type,
          rating: newFeedback.rating,
          comment: newFeedback.comment,
          timestamp: new Date().toISOString(),
          user: response.data.user ? {
            username: response.data.user.username,
            profilePic: response.data.user.profilePic ? `${SERVER_URL}/uploads/${response.data.user.profilePic}` : 'No profile picture'
          } : 'Anonymous'
        });
        toast.success(newFeedback.type === 'feedback' ? 'Thank you for your feedback!' : 'Question submitted successfully!');
        
        setNewFeedback({
          type: 'feedback',
          rating: 0,
          comment: ''
        });
        fetchUserReviews(); // Refresh the reviews list
      } else {
        toast.error(response.data?.message || 'Error submitting review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    }
  };

  const handleRatingChange = (rating) => {
    setNewFeedback(prev => ({ ...prev, rating }));
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        onClick={() => handleRatingChange(index + 1)}
        style={{ cursor: 'pointer' }}
      >
        {index < (rating || 0) ? (
          <Star className="text-warning" />
        ) : (
          <StarBorder className="text-warning" />
        )}
      </span>
    ));
  };

  return (
    <Container className="pt-0 pb-5">
      <h2 className="text-center text-white mb-4">Help & Feedback</h2>
      
      {/* Feedback Form */}
      <Card className="mb-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', maxWidth: '600px', margin: '0 auto' }}>
        <Card.Body className="p-3">
          <h5 className="text-white mb-2">
            {newFeedback.type === 'feedback' ? (
              <><Feedback className="me-2" /> Share Your Experience</>
            ) : (
              <><QuestionAnswer className="me-2" /> Ask a Question</>
            )}
          </h5>
          <Form onSubmit={handleSubmitFeedback} className="d-flex flex-column gap-2">
            <Form.Group>
              <div className="d-flex gap-2">
                <Button
                  size="sm"
                  variant={newFeedback.type === 'feedback' ? 'primary' : 'outline-light'}
                  onClick={() => setNewFeedback(prev => ({ ...prev, type: 'feedback' }))}
                >
                  <Feedback className="me-1" /> Give Feedback
                </Button>
                <Button
                  size="sm"
                  variant={newFeedback.type === 'question' ? 'primary' : 'outline-light'}
                  onClick={() => setNewFeedback(prev => ({ ...prev, type: 'question' }))}
                >
                  <QuestionAnswer className="me-1" /> Ask a Question
                </Button>
              </div>
            </Form.Group>

            {newFeedback.type === 'feedback' && (
              <Form.Group>
                <div className="d-flex gap-1">
                  {renderStars(newFeedback.rating)}
                </div>
              </Form.Group>
            )}

            <Form.Group>
              <Form.Control
                as="textarea"
                rows={2}
                value={newFeedback.comment}
                onChange={(e) => setNewFeedback(prev => ({ ...prev, comment: e.target.value }))}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '0.9rem'
                }}
                placeholder={newFeedback.type === 'feedback' ? 
                  'Share your thoughts about our app and service...' : 
                  'What would you like to know?'}
              />
            </Form.Group>

            <Button variant="outline-light" type="submit" size="sm" className="align-self-end">
              {newFeedback.type === 'feedback' ? 'Submit Feedback' : 'Submit Question'}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Feedback and Questions List */}
      <div className="mt-5">
        <h4 className="text-white mb-4">Recent Feedbacks & Questions</h4>
        <Row xs={1} md={2} lg={3} className="g-4">
          {feedbacks.slice(0, 9).map((feedback) => (
            <Col key={feedback._id}>
              <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={feedback.user.profilePic}
                      alt={feedback.user.username}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        marginRight: '10px',
                        objectFit: 'cover'
                      }}
                    />
                    <div>
                      <h6 className="mb-0 text-white">{feedback.user.username}</h6>
                      <small className="text-white-50">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>

                  {feedback.type === 'feedback' && (
                    <div className="mb-2">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className={index < feedback.rating ? 'text-warning' : 'text-secondary'}
                          style={{ fontSize: '1rem' }}
                        />
                      ))}
                    </div>
                  )}

                  <Card.Text className="text-white-50" style={{ whiteSpace: 'pre-wrap' }}>
                    {feedback.comment}
                  </Card.Text>

                  <Badge
                    bg={feedback.type === 'feedback' ? 'primary' : 'info'}
                    className="mt-2"
                  >
                    {feedback.type === 'feedback' ? 'Feedback' : 'Question'}
                  </Badge>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
};

export default SpecialOffers;