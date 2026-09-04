const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const localStore = require('../config/localStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_sih_2026_cc_cie');

      if (isDbConnected()) {
        try {
          req.user = await User.findById(decoded.id).select('-password');
        } catch (err) {
          req.user = null;
        }
      }

      if (!req.user) {
        const localUser = localStore.findUserById(decoded.id) || localStore.findUserByEmail(decoded.email);
        if (localUser) {
          req.user = { _id: localUser._id, email: localUser.email, role: localUser.role, teamId: localUser.teamId };
        } else if (decoded.id && decoded.email) {
          req.user = { _id: decoded.id, email: decoded.email, role: decoded.role || 'leader' };
        }
      }

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
