import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = ({ setAuthToken }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(password != confirmPassword){
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      setAuthToken(token);
      navigate('/');
    } catch (err) {
      setError("There was an error registering the user. Please try again");
    }
  };

  return (
    <div className='register-container'>
      <div className='register-form'>
        <h2>Register</h2>
        {error && <p className='error'>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className='input-group'>
            <label htmlFor='name'>Enter your name</label>
            <input  
              type="text"
              id="name" 
              value = {name}
              onChange={(e) => setName(e.target.value)}
              required />
          </div>
          <div className='input-group'>
            <label htmlFor='email'>Please enter your email address</label>
            <input
              type="email"
              id="email"
              value = {email}
              onChange={(e)=> setEmail(e.target.value)}
              required />
          </div>
          <div className='input-group'>
            <label htmlFor='password'>Enter your password</label>
            <input
              type="password"
              id="password"
              value = {password}
              onChange={(e)=> setPassword(e.target.value)}
              required />
          </div>
          <div className='input-group'>
            <label htmlFor='confirmPassword'>Confirm your password</label>
            <input
              type="password"
              id="confirmPassword"
              value = {confirmPassword}
              onChange={(e)=> setConfirmPassword(e.target.value)}
              required />
          </div>
          <button type="submit" className='register-button'>Register</button>
        </form>
      </div>
    </div>  
  );
};

export default Register;
