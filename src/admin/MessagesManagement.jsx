import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import { Visibility, Check, QuestionAnswer, Feedback, Star, Delete } from '@mui/icons-material';
import { getAllReviewsAPI, updateReviewStatusAPI, deleteReviewAPI } from '../services/allAPI';
import { toast } from 'react-toastify';
import SERVER_URL from '../services/serviceURL';
import useImg from '../assets/userimage.png'



const MessagesManagement = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const result = await getAllReviewsAPI();
      if (result.status === 200) {
        const transformedMessages = result.data.map(message => ({
          ...message,
          user: message.userId ? {
            username: message.userId.username,
            profilePic: message.userId.profilePic
          } : null
        }));
        setMessages(transformedMessages);
      } else {
        setError('Failed to fetch messages');
        toast.error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Error fetching messages');
      toast.error('Error fetching messages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowDetails = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        const result = await deleteReviewAPI(reviewId);
        if (result.status === 200) {
          toast.success('Review deleted successfully');
          fetchMessages(); // Refresh the messages list
        } else {
          toast.error(result.data?.message || 'Failed to delete review');
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        toast.error('Failed to delete review');
      }
    }
  };

  const handleUpdateStatus = async (reviewId, newStatus) => {
    try {
      const result = await updateReviewStatusAPI(reviewId, { status: newStatus });
      if (result.status === 200) {
        toast.success('Review status updated successfully');
        fetchMessages(); // Refresh the messages list
        setShowModal(false);
      } else {
        toast.error(result.data?.message || 'Failed to update review status');
      }
    } catch (error) {
      console.error('Error updating review status:', error);
      toast.error('Failed to update review status');
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'warning',
      approved: 'success',
      rejected: 'danger'
    };
    return (
      <Badge bg={statusColors[status] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star 
        key={index} 
        className={index < rating ? 'text-warning' : 'text-secondary'}
        style={{ fontSize: '1rem' }}
      />
    ));
  };

  const filteredMessages = messages.filter(message => {
    if (filter === 'all') return true;
    return message.type === filter;
  });

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMessages.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5 text-white">
        <h4>{error}</h4>
        <Button variant="outline-light" onClick={fetchMessages}>Retry</Button>
      </div>
    );
  }

  return (
    <>
      <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Card.Body>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
            <h5 className="text-white mb-3 mb-md-0">Messages Management</h5>
            <div className="d-flex gap-2 align-items-center">
              <Form.Select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                size="sm"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  width: 'auto',
                  minWidth: '100px'
                }}
              >
                <option value="5" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>5 / page</option>
                <option value="10" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>10 / page</option>
                <option value="20" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>20 / page</option>
                <option value="50" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>50 / page</option>
              </Form.Select>
              <Form.Select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setCurrentPage(1);
                }}
                size="sm"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  width: 'auto',
                  minWidth: '150px'
                }}
              >
                <option value="all" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>All Messages</option>
                <option value="feedback" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Feedbacks</option>
                <option value="question" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>Questions</option>
              </Form.Select>
            </div>
          </div>
          
          <div className="table-responsive">
            <Table hover className="table-dark" style={{ backgroundColor: 'transparent', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Type</th>
                  <th>Content</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((message) => (
                  <tr key={message._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={message.user?.profilePic ? `${SERVER_URL}/uploads/${message.user.profilePic}` : useImg}
                          alt="User"
                          style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span>{message.user?.username || 'Anonymous'}</span>
                      </div>
                    </td>
                    <td>
                      <Badge bg={message.type === 'feedback' ? 'primary' : 'info'}>
                        {message.type === 'feedback' ? 'Feedback' : 'Question'}
                      </Badge>
                    </td>
                    <td>
                      <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {message.comment}
                      </div>
                    </td>
                    <td>
                      {message.type === 'feedback' && renderStars(message.rating)}
                    </td>
                    <td>{getStatusBadge(message.status || 'pending')}</td>
                    <td>{new Date(message.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => handleShowDetails(message)}
                        >
                          <Visibility fontSize="small" />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(message._id)}
                        >
                          <Delete fontSize="small" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="text-white-50">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredMessages.length)} of {filteredMessages.length} entries
            </div>
            <div className="d-flex gap-1">
              <Button
                variant="outline-light"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {[...Array(totalPages)].map((_, index) => (
                <Button
                  key={index + 1}
                  variant={currentPage === index + 1 ? 'light' : 'outline-light'}
                  size="sm"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Button>
              ))}
              <Button
                variant="outline-light"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Message Details Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
        fullscreen="sm-down"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
        contentClassName="bg-transparent"
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: 'rgba(33, 33, 33, 0.8)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Modal.Title className="text-white">
            {selectedMessage?.type === 'feedback' ? 'Feedback Details' : 'Question Details'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: 'rgba(33, 33, 33, 0.8)',
            color: 'white',
            backdropFilter: 'blur(10px)'
          }}
        >
          {selectedMessage && (
            <div className="message-details">
              <div className="d-flex align-items-center mb-3">
                <img
                  src={selectedMessage.user?.profilePic ? `${SERVER_URL}/uploads/${selectedMessage.user.profilePic}` : useImg}
                  alt="User"
                  style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '15px', objectFit: 'cover' }}
                />
                <div>
                  <h6 className="mb-0">{selectedMessage.user?.username || 'Anonymous'}</h6>
                  <small className="text-white-50">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>

              {selectedMessage.type === 'feedback' && (
                <div className="mb-3">
                  <h6 className="text-white-50 mb-2">Rating</h6>
                  <div className="d-flex gap-1">
                    {renderStars(selectedMessage.rating)}
                  </div>
                </div>
              )}

              <div className="mb-3">
                <h6 className="text-white-50 mb-2">
                  {selectedMessage.type === 'feedback' ? 'Feedback' : 'Question'}
                </h6>
                <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                  {selectedMessage.comment}
                </p>
              </div>

              <div className="mb-3">
                <h6 className="text-white-50 mb-2">Status</h6>
                <div className="d-flex gap-2">
                  <Button
                    variant={selectedMessage.status === 'approved' ? 'success' : 'outline-success'}
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedMessage._id, 'approved')}
                  >
                    <Check fontSize="small" className="me-1" />
                    Approve
                  </Button>
                  <Button
                    variant={selectedMessage.status === 'rejected' ? 'danger' : 'outline-danger'}
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedMessage._id, 'rejected')}
                  >
                    <span className="me-1">×</span>
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: 'rgba(33, 33, 33, 0.8)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Button variant="outline-light" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MessagesManagement;