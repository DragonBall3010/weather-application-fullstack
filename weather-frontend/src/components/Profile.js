// src/components/Profile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = ({logout}) => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      const fetchUserProfile = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/auth/profile', {
            headers: {
              'Authorization': `${token}`
            }
          });
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          navigate('/login');
        }
      };

      fetchUserProfile();
    }
  }, [navigate, token]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

//   return (
//     <div className="profile-container">
//       <h1>Profile</h1>
//       {user && (
//         <div>
//           <p><strong>Name:</strong> {user.name}</p>
//           <p><strong>Email:</strong> {user.email}</p>
//         </div>
//       )}
//       <button onClick={handleLogout}>Logout</button>
//     </div>
//   );
    return (
        <div className="profile-container">
        <h1>Profile</h1>
        {user && user.name && user.email ? (
            <div>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            </div>
        ) : (
            <p>Loading user information...</p>
        )}
        <button onClick={handleLogout}>Logout</button>
        </div>
  );
};

export default Profile;
