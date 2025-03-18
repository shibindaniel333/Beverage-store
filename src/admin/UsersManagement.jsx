import React, { useEffect, useState } from "react";
import { Card, Table, Button, Modal } from "react-bootstrap";
import {
  Delete,
  Add,
  Visibility,
  LocationOn,
  Email,
  Person,
} from "@mui/icons-material";
import {
  deleteUserAPI,
  getAllUsersAPI,
  getUserOrderHistoryAPI,
} from "../services/allAPI";
import { toast } from "react-toastify";
import SERVER_URL from '../services/serviceURL';
import useImg from  '../assets/userimage.png'


const UsersManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userOrders, setUserOrders] = useState({});
  const [userOrderData, setUserOrderData] = useState(null);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getAllUsersAPI();
      if (result.status === 200) {
        setUsers(result.data);
      } else {
        setError("Failed to fetch users");
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Error fetching users");
      toast.error("Error fetching users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const result = await deleteUserAPI(userId);
        if (result.status === 200) {
          toast.success("User deleted successfully");
          setUsers(users.filter((user) => user._id !== userId));
        } else {
          toast.error("Failed to delete user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Error deleting user");
      }
    }
  };

  const handleShowModal = async (user) => {
    setSelectedUser(user);
    setShowModal(true);
    setIsLoadingOrders(true);
    
    try {
      const result = await getUserOrderHistoryAPI(user._id);
      if (result.status === 200) {
        setUserOrderData(result.data);
      } else {
        console.error("Failed to fetch user order history");
        toast.error("Failed to fetch user order details");
      }
    } catch (error) {
      console.error("Error fetching user order history:", error);
      toast.error("Error fetching user details");
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setUserOrderData(null);
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
        <Button variant="outline-light" onClick={fetchUsers}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <Card
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="text-white mb-0">Users Management</h5>
            <Button
              variant="primary"
              size="sm"
              disabled
              style={{ opacity: 0.6, cursor: "not-allowed", display: "none" }}
            >
              <Add /> Add User
            </Button>
          </div>
          <Table
            hover
            className="table-dark"
            style={{
              backgroundColor: "transparent",
              borderColor: "rgba(255, 255, 255, 0.1)",
            }}
          >
            <thead>
              <tr>
                <th>Profile</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Registered Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <img
                      src={
                        user.profilePic
                          ? `${SERVER_URL}/uploads/${user.profilePic}`
                          : useImg
                      }
                      alt={user.name}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Button
                      variant="outline-info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowModal(user)}
                    >
                      <Visibility fontSize="small" />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      <Delete fontSize="small" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        backdrop="static"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        contentClassName="bg-transparent"
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "rgba(33, 33, 33, 0.8)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Modal.Title className="text-white">User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: "rgba(33, 33, 33, 0.8)",
            color: "white",
            backdropFilter: "blur(10px)",
          }}
        >
          {selectedUser && (
            <div className="user-details">
              <div className="d-flex align-items-center mb-3">
                <Person
                  sx={{ fontSize: 30, marginRight: 2, color: "#2196F3" }}
                />
                <div>
                  <h6 className="mb-0">User ID</h6>
                  <p className="mb-0 text-white-50">#{selectedUser._id}</p>
                </div>
              </div>
              <div className="d-flex align-items-center mb-3">
                <Person
                  sx={{ fontSize: 30, marginRight: 2, color: "#2196F3" }}
                />
                <div>
                  <h6 className="mb-0">Name</h6>
                  <p className="mb-0 text-white-50">{selectedUser.username}</p>
                </div>
              </div>

              <div className="d-flex align-items-center mb-3">
                <Email
                  sx={{ fontSize: 30, marginRight: 2, color: "#2196F3" }}
                />
                <div>
                  <h6 className="mb-0">Email</h6>
                  <p className="mb-0 text-white-50">{selectedUser.email}</p>
                </div>
              </div>

         

              {isLoadingOrders ? (
                <div className="text-center py-3">
                  <div className="spinner-border spinner-border-sm text-info" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-white-50">Loading order information...</p>
                </div>
              ) : userOrderData ? (
                <>
                  <div className="d-flex align-items-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#2196F3" className="bi bi-cash-stack me-2" viewBox="0 0 16 16">
                      <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                      <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2z" />
                    </svg>
                    <div>
                      <h6 className="mb-0"> Total Purchase</h6>
                      <p className="mb-0 text-white-50">
                        ${userOrderData.totalPurchaseAmount?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#2196F3" className="bi bi-bag-check me-2" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0" />
                      <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                    </svg>
                    <div>
                      <h6 className="mb-0">Order Count</h6>
                      <p className="mb-0 text-white-50">
                        {userOrderData.orderCount || 0} orders
                      </p>
                    </div>
                  </div>

                  {userOrderData.locations && userOrderData.locations.length > 0 && (
                    <div className="d-flex align-items-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#2196F3" className="bi bi-geo-alt me-2" viewBox="0 0 16 16">
                        <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                        <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                      </svg>
                      <div>
                        <h6 className="mb-0">Delivery Locations</h6>
                        <p className="mb-0 text-white-50">
                          {userOrderData.locations.join(", ")}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-3">
                  <p className="text-white-50">No order information available</p>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: "rgba(33, 33, 33, 0.8)",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Button variant="outline-light" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UsersManagement;