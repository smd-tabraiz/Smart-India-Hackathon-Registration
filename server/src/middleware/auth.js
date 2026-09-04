const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_sih_2026_cc_cie');
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

const adminProtect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_sih_2026_cc_cie');
      if (decoded.role === 'admin') {
        req.user = { id: decoded.id, role: 'admin', email: decoded.email };
        return next();
      } else {
        return res.status(403).json({ message: 'Access denied: Admin authorization required' });
      }
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, admin token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no admin token' });
  }
};

module.exports = { protect, adminProtect };
