const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const Team = require('../models/Team');
const localStore = require('../config/localStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

const generateToken = (id, role = 'leader', email = '') => {
  return jwt.sign(
    { id, role, email },
    process.env.JWT_SECRET || 'super_secret_jwt_key_sih_2026_cc_cie',
    { expiresIn: '7d' }
  );
};

const getAdminAccounts = () => [
  {
    email: (process.env.ADMIN_EMAIL || 'admin@codersclub.edu.in').toLowerCase().trim(),
    password: (process.env.ADMIN_PASSWORD || 'AdminSIH2026!Secure').trim(),
  },
  {
    email: (process.env.ADMIN_EMAIL_2 || 'asmaeram006@gmail.com').toLowerCase().trim(),
    password: (process.env.ADMIN_PASSWORD_2 || 'asma@codersclub').trim(),
  },
];

const matchAdminCredentials = (inputEmail, inputPassword) => {
  if (!inputEmail || !inputPassword) return null;
  const formattedEmail = inputEmail.toLowerCase().trim();
  const trimmedPass = inputPassword.trim();
  const admins = getAdminAccounts();

  return admins.find(
    (acc) => acc.email === formattedEmail && (acc.password === inputPassword || acc.password === trimmedPass)
  ) || null;
};

// @desc    Leader Login (also supports Admin if admin logs in here)
// @route   POST /api/auth/login
// @access  Public
const loginLeader = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const formattedEmail = email.toLowerCase().trim();

    // Check if logging in with Admin credentials
    const adminMatch = matchAdminCredentials(formattedEmail, password);
    if (adminMatch) {
      const token = generateToken(`admin-${adminMatch.email}`, 'admin', adminMatch.email);
      return res.json({
        _id: `admin-${adminMatch.email}`,
        email: adminMatch.email,
        role: 'admin',
        token,
      });
    }

    // 1. Try DB if connected
    let user = null;
    let team = null;

    if (isDbConnected()) {
      try {
        user = await User.findOne({ email: formattedEmail });
      } catch (err) {
        user = null;
      }
    }

    // 2. Fallback to local persistent store if DB is offline or user not found in DB
    if (!user) {
      const localUser = localStore.findUserByEmail(formattedEmail);
      if (localUser) {
        const isMatch = await localStore.comparePassword(password, localUser.password);
        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }
        team = localStore.findTeamByLeaderIdOrEmail(localUser._id, localUser.email);
        return res.json({
          _id: localUser._id,
          email: localUser.email,
          role: localUser.role,
          teamId: team ? team.teamId : localUser.teamId,
          team: team || null,
          token: generateToken(localUser._id, localUser.role, localUser.email),
        });
      }
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // DB User found: verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (isDbConnected()) {
      try {
        team = await Team.findOne({ leaderUser: user._id });
      } catch (err) {
        team = null;
      }
    }
    if (!team) {
      team = localStore.findTeamByLeaderIdOrEmail(user._id, user.email);
    }

    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      teamId: team ? team.teamId : user.teamId,
      team: team || null,
      token: generateToken(user._id, user.role, user.email),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Error during login' });
  }
};

// @desc    Admin Login
// @route   POST /api/auth/admin-login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const inputEmail = email.toLowerCase().trim();

    const adminMatch = matchAdminCredentials(inputEmail, password);
    if (adminMatch) {
      const token = generateToken(`admin-${adminMatch.email}`, 'admin', adminMatch.email);
      return res.json({
        _id: `admin-${adminMatch.email}`,
        email: adminMatch.email,
        role: 'admin',
        token,
      });
    }

    // Also check database if any user has role 'admin'
    if (isDbConnected()) {
      try {
        const user = await User.findOne({ email: inputEmail, role: 'admin' });
        if (user && (await user.matchPassword(password))) {
          return res.json({
            _id: user._id,
            email: user.email,
            role: 'admin',
            token: generateToken(user._id, 'admin', user.email),
          });
        }
      } catch (err) {
        // DB offline
      }
    }

    return res.status(401).json({ message: 'Invalid admin credentials' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Current Leader Profile & Team
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    let user = null;
    let team = null;

    if (isDbConnected()) {
      try {
        user = await User.findById(req.user._id).select('-password');
        team = await Team.findOne({ leaderUser: req.user._id });
      } catch (err) {
        user = null;
        team = null;
      }
    }

    if (!user) {
      const localUser = localStore.findUserById(req.user._id) || localStore.findUserByEmail(req.user.email);
      if (localUser) {
        user = { _id: localUser._id, email: localUser.email, role: localUser.role, teamId: localUser.teamId };
      } else {
        user = req.user;
      }
    }

    if (!team) {
      team = localStore.findTeamByLeaderIdOrEmail(req.user._id, req.user.email);
    }

    res.json({
      user,
      team: team || null,
      whatsappGroupLink: process.env.WHATSAPP_GROUP_LINK || 'https://chat.whatsapp.com/EIoDz1GewoZLVXYJEdfR0t?s=sw&p=a&mlu=4&ilr=4'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  loginLeader,
  loginAdmin,
  getMe,
  generateToken,
};
