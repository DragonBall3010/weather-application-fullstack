// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('Authorization');

  console.log('Token received:', token); // Add this line to log the token received

  // Check if not token
  if (!token) {
    console.log('No token, authorization denied'); // Add this line to log no token case
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  

    console.log('Token decoded:', decoded); // Add this line to log decoded token

    req.user = decoded.user;
    next();
  } catch (err) {
    console.log('Token is not valid:', err.message); // Add this line to log invalid token case
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
