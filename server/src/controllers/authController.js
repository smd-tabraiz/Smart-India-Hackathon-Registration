const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Team = require('../models/Team');

const generateToken = (id, role = 'leader', email = '') => {
  return jwt.sign(
    { id, role, email },
    process.env.JWT_SECRET || 'super_secret_jwt_key_sih_2026_cc_cie',
    { expiresIn: '7d' }
  );
};

// @desc    Leader Login
// @route   POST /api/auth/login
// @access  Public
const loginLeader = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const team = await Team.findOne({ leaderUser: user._id });

    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      teamId: team ? team.teamId : user.teamId,
      team: team || null,
      token: generateToken(user._id, user.role, user.email),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin Login
// @route   POST /api/auth/admin-login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@codersclub.edu.in';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminSIH2026!Secure';

    if (email.toLowerCase() === adminEmail.toLowerCase() && password === adminPassword) {
      const token = generateToken('admin-static-id', 'admin', adminEmail);
      return res.json({
        email: adminEmail,
        role: 'admin',
        token,
      });
    }

    // Also check database if any user has role 'admin'
    const user = await User.findOne({ email: email.toLowerCase(), role: 'admin' });
    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        email: user.email,
        role: 'admin',
        token: generateToken(user._id, 'admin', user.email),
      });
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
    const user = await User.findById(req.user._id).select('-password');
    const team = await Team.findOne({ leaderUser: req.user._id });

    res.json({
      user,
      team: team || null,
      whatsappGroupLink: team ? (process.env.WHATSAPP_GROUP_LINK || 'https://chat.whatsapp.com/SIH2026CodersClubCIE') : null
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
