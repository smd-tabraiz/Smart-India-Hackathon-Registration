const express = require('express');
const router = express.Router();
const { registerTeam, getMyTeam, updateMyTeam } = require('../controllers/teamController');
const { protect } = require('../middleware/auth');

router.post('/register', registerTeam);
router.get('/my-team', protect, getMyTeam);
router.put('/my-team', protect, updateMyTeam);

module.exports = router;
