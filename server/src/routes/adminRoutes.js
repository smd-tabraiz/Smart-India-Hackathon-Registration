const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAdminTeams,
  getAdminTeamById,
  updateAdminTeam,
  deleteAdminTeam,
  exportCsv,
} = require('../controllers/adminController');
const { adminProtect } = require('../middleware/auth');

router.get('/stats', adminProtect, getAdminStats);
router.get('/teams', adminProtect, getAdminTeams);
router.get('/teams/:id', adminProtect, getAdminTeamById);
router.put('/teams/:id', adminProtect, updateAdminTeam);
router.delete('/teams/:id', adminProtect, deleteAdminTeam);
router.get('/export-csv', adminProtect, exportCsv);

module.exports = router;
