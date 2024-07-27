import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = ({ setAuthToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      setAuthToken(token);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div classname="login-container">
      <div classname = "login-form">
        <h2>Login to Weathery</h2>
        {error && <p className='error'>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className='input-group'>
            <label htmlFor='email'>Enter your email address</label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
              required />
          </div>
          <div className='input-group'>
            <label htmlFor='password'>Enter your password</label>
            <input  
              type='password'
              id='password'
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
              required />
          </div>
          <button type ='submit' className='login-button'>Login</button>
        </form>
        <p className='register-link'>
          Don't have an account? <a href = "/register">Register here</a>
        </p>
      </div>
    </div>
  )
};

export default Login;
