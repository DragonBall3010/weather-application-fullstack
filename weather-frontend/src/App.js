import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Favorites from './components/Favorites';
import Sidebar from './components/Sidebar'; // Import Sidebar
import Profile from './components/Profile';

import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    if (token) {
      setIsAuthenticated(true);
      axios.defaults.headers.common['Authorization'] = `${token}`;
    }
  }, []);

  const setAuthToken = (token) => {
    setIsAuthenticated(true);
    axios.defaults.headers.common['Authorization'] = `${token}`;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/');
  };

  const addFavorite = async (city, temperature, description) => {
    try {
      await axios.post('http://localhost:5000/api/weather/favorites', { 
        city,
        temperature,
        description
      });
      alert('City added to favorites');
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="app-container">
      <Sidebar key={isAuthenticated} isAuthenticated={isAuthenticated} /> {/* Include Sidebar */}
      <div className="main-content">
        {/* <Navbar isAuthenticated={isAuthenticated} logout={logout} /> */}
        <Routes>
          <Route path="/" element={<Home isAuthenticated={isAuthenticated} addFavorite={addFavorite} />} />
          <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
          <Route path="/register" element={<Register setAuthToken={setAuthToken} />} />
          <Route path="/profile" element={<Profile logout={logout} />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
