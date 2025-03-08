import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { PhotoCamera, Email, Person, AccessTime, CheckCircle } from '@mui/icons-material';
import { IconButton, Badge } from '@mui/material';
import { getProfileAPI, updateProfileAPI } from '../services/allAPI';
import { toast } from 'react-toastify';
import SERVER_URL from '../services/serviceURL';


const Profile = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await getProfileAPI();
        if (result.status === 200) {
          setUserData(result.data);
        } else {
          setError('Failed to fetch profile data');
          toast.error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Error fetching profile data');
        toast.error('Error fetching profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUpdating(true);

      const formData = new FormData();
      formData.append('profilePic', file);

      const result = await updateProfileAPI(formData);
      if (result.status === 200) {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          const base64Image = reader.result;
          setSelectedImg(base64Image);
          setUserData(prevData => ({ ...prevData, profilePic: result.data.profilePic }));
          toast.success('Profile picture updated successfully');
        };
      } else {
        toast.error('Failed to update profile picture');
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      toast.error('Error updating profile picture');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <Container className="pt-0 pb-5">
        <div className="text-center py-5">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error || !userData) {
    return (
      <Container className="pt-0 pb-5">
        <div className="text-center py-5 text-white">
          <h4>{error || 'Profile not found'}</h4>
        </div>
      </Container>
    );
  }

  return (
    <Container className="pt-0 pb-5">
      <div className="max-w-2xl mx-auto p-4 py-8" style={{ maxWidth: '600px' }}>
        <div 
          style={{
            backgroundColor: 'rgba(9, 9, 9, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '2rem'
          }}
          className="space-y-8"
        >
          <div className="text-center text-white">
            <h2 className="text-2xl font-semibold">Profile</h2>
            <p className="mt-2 text-white-50">Your profile information</p>
          </div>

          {/* Avatar Upload Section */}
          <div className="d-flex flex-column align-items-center gap-3">
            <div className="position-relative">
              <img
                src={selectedImg || (userData.profilePic ? `${SERVER_URL}/uploads/${userData.profilePic}` : '/src/assets/userimage.png')}
                alt="Profile"
                style={{
                  width: '128px',
                  height: '128px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid rgba(255, 255, 255, 0.2)'
                }}
              />
              <label
                htmlFor="avatar-upload"
                className="position-absolute bottom-0 end-0"
                style={{
                  cursor: 'pointer',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  padding: '8px',
                  margin: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                <PhotoCamera style={{ color: 'white' }} />
                <input
                  type="file"
                  id="avatar-upload"
                  className="d-none"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdating}
                />
              </label>
            </div>
            <p className="text-white-50 small">
              {isUpdating ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2 text-white-50">
                <Person fontSize="small" />
                <span>Full Name</span>
              </div>
              <div 
                className="p-3 rounded mb-2" 
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <span className="text-white">{userData.username || 'Not specified'}</span>
              </div>
            </div>

            <div>
              <div className="d-flex align-items-center gap-2 mb-2 text-white-50">
                <Email fontSize="small" />
                <span>Email Address</span>
              </div>
              <div 
                className="p-3 rounded mb-2" 
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <span className="text-white">{userData.email || 'Not specified'}</span>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div 
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '1.5rem'
            }}
          >
            <h3 className="text-white mb-4">Account Information</h3>
            <div className="space-y-3">
              <div 
                className="d-flex justify-content-between py-2" 
                style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}
              >
                <span className="text-white-50">Member Since</span>
                <span className="text-white">{new Date(userData.createdAt).toLocaleDateString() || 'Not available'}</span>
              </div>
              <div className="d-flex justify-content-between py-2">
                <span className="text-white-50">Account Type</span>
                <span className="text-success d-flex align-items-center gap-1">

                  <CheckCircle fontSize="small" />
                  {userData.role === 'admin' ? 'Administrator' : 'User'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Profile;