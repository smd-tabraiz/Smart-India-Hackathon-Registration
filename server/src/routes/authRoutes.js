const express = require('express');
const router = express.Router();
const { loginLeader, loginAdmin, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', loginLeader);
router.post('/admin-login', loginAdmin);
router.get('/me', protect, getMe);

module.exports = router;
