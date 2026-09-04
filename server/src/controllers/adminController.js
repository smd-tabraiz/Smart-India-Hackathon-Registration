const mongoose = require('mongoose');
const Team = require('../models/Team');
const User = require('../models/User');
const localStore = require('../config/localStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get admin statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    let teams = [];
    if (isDbConnected()) {
      try {
        teams = await Team.find();
      } catch (err) {
        teams = localStore.getTeams();
      }
    } else {
      teams = localStore.getTeams();
    }

    const totalTeams = teams.length;
    const totalStudents = totalTeams * 6;

    let femaleParticipants = 0;
    teams.forEach((t) => {
      t.members.forEach((m) => {
        if (m.gender === 'Female' || m.gender === 'F') femaleParticipants++;
      });
    });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const registrationsToday = teams.filter(
      (t) => new Date(t.createdAt) >= startOfToday
    ).length;

    res.json({
      totalTeams,
      totalStudents,
      femaleParticipants,
      registrationsToday,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get filtered list of teams
// @route   GET /api/admin/teams
// @access  Private (Admin)
const getAdminTeams = async (req, res) => {
  try {
    const { search, problemStatementId, branch, year } = req.query;

    let teams = [];
    if (isDbConnected()) {
      try {
        teams = await Team.find().sort({ createdAt: -1 });
      } catch (err) {
        teams = localStore.getTeams();
      }
    } else {
      teams = localStore.getTeams();
    }

    if (search) {
      const q = search.trim().toLowerCase();
      teams = teams.filter((t) => {
        const matchesTeamId = t.teamId.toLowerCase().includes(q);
        const matchesTeamName = t.teamName.toLowerCase().includes(q);
        const matchesLeaderEmail = t.leaderEmail.toLowerCase().includes(q);
        const matchesMember = t.members.some(
          (m) =>
            m.name.toLowerCase().includes(q) ||
            m.rollNumber.toLowerCase().includes(q)
        );
        return matchesTeamId || matchesTeamName || matchesLeaderEmail || matchesMember;
      });
    }

    if (problemStatementId) {
      teams = teams.filter(
        (t) => t.problemStatementId.toUpperCase() === problemStatementId.toUpperCase()
      );
    }

    if (branch) {
      teams = teams.filter((t) =>
        t.members.some((m) => m.branch.toUpperCase() === branch.toUpperCase())
      );
    }

    if (year) {
      teams = teams.filter((t) =>
        t.members.some((m) => m.year === year)
      );
    }

    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper to safely find team in DB or localStore
const findTeamInDbOrLocal = async (idOrTeamId) => {
  if (!idOrTeamId) return null;
  const target = String(idOrTeamId).trim();
  
  if (isDbConnected()) {
    try {
      if (mongoose.Types.ObjectId.isValid(target)) {
        const team = await Team.findById(target);
        if (team) return team;
      }
      const teamByTeamId = await Team.findOne({ teamId: target.toUpperCase() });
      if (teamByTeamId) return teamByTeamId;
    } catch (err) {
      // Proceed to localStore
    }
  }

  return localStore.findTeamById(target);
};

// @desc    Get single team detail
// @route   GET /api/admin/teams/:id
// @access  Private (Admin)
const getAdminTeamById = async (req, res) => {
  try {
    const team = await findTeamInDbOrLocal(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update team status / details by admin
// @route   PUT /api/admin/teams/:id
// @access  Private (Admin)
const updateAdminTeam = async (req, res) => {
  try {
    const { teamName, problemStatementId, registrationStatus, members } = req.body;
    const target = req.params.id;

    let dbTeam = null;
    if (isDbConnected()) {
      try {
        if (mongoose.Types.ObjectId.isValid(target)) {
          dbTeam = await Team.findById(target);
        }
        if (!dbTeam) {
          dbTeam = await Team.findOne({ teamId: String(target).trim().toUpperCase() });
        }
        if (dbTeam) {
          if (teamName) dbTeam.teamName = teamName.trim();
          if (problemStatementId) dbTeam.problemStatementId = problemStatementId.trim().toUpperCase();
          if (registrationStatus) dbTeam.registrationStatus = registrationStatus;
          if (members && Array.isArray(members)) dbTeam.members = members;
          await dbTeam.save();
        }
      } catch (err) {
        dbTeam = null;
      }
    }

    // Always keep local store in sync
    const updates = {};
    if (teamName) updates.teamName = teamName.trim();
    if (problemStatementId) updates.problemStatementId = problemStatementId.trim().toUpperCase();
    if (registrationStatus) updates.registrationStatus = registrationStatus;
    if (members && Array.isArray(members)) updates.members = members;

    const localTeam = localStore.updateTeam(target, updates);

    const resultTeam = dbTeam || localTeam;
    if (!resultTeam) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json({ message: 'Team updated successfully by admin', team: resultTeam });
  } catch (error) {
    console.error('Error updating admin team:', error);
    res.status(500).json({ message: error.message || 'Error updating team' });
  }
};

// @desc    Delete or Disqualify team by admin
// @route   DELETE /api/admin/teams/:id
// @access  Private (Admin)
const deleteAdminTeam = async (req, res) => {
  try {
    const target = req.params.id;
    let deletedTeam = null;

    if (isDbConnected()) {
      try {
        let dbTeam = null;
        if (mongoose.Types.ObjectId.isValid(target)) {
          dbTeam = await Team.findById(target);
        }
        if (!dbTeam) {
          dbTeam = await Team.findOne({ teamId: String(target).trim().toUpperCase() });
        }

        if (dbTeam) {
          deletedTeam = { teamId: dbTeam.teamId, teamName: dbTeam.teamName };
          if (dbTeam.leaderUser) {
            await User.findByIdAndDelete(dbTeam.leaderUser);
          }
          await Team.findByIdAndDelete(dbTeam._id);
        }
      } catch (err) {
        // DB error or offline
      }
    }

    // Also remove from local store
    const localDeleted = localStore.deleteTeam(target);
    if (!deletedTeam && localDeleted) {
      deletedTeam = { teamId: localDeleted.teamId, teamName: localDeleted.teamName };
    }

    if (!deletedTeam) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json({ message: `Team ${deletedTeam.teamId} (${deletedTeam.teamName}) deleted successfully.` });
  } catch (error) {
    console.error('Error deleting admin team:', error);
    res.status(500).json({ message: error.message || 'Error deleting team' });
  }
};

// @desc    Export registration data as CSV
// @route   GET /api/admin/export-csv
// @access  Private (Admin)
const exportCsv = async (req, res) => {
  try {
    let teams = [];
    if (isDbConnected()) {
      try {
        teams = await Team.find().sort({ createdAt: -1 });
      } catch (err) {
        teams = localStore.getTeams();
      }
    } else {
      teams = localStore.getTeams();
    }

    let csvRows = [];
    csvRows.push([
      'Team ID',
      'Team Name',
      'Problem Statement ID',
      'Leader Email',
      'Member Role',
      'Student Name',
      'Roll Number',
      'Year',
      'Branch',
      'Gender',
      'Category',
      'Registration Date',
      'Status'
    ].map(field => `"${field}"`).join(','));

    teams.forEach((t) => {
      t.members.forEach((m) => {
        const row = [
          t.teamId,
          t.teamName,
          t.problemStatementId,
          t.leaderEmail,
          m.isLeader ? 'Leader' : 'Member',
          m.name,
          m.rollNumber,
          m.year,
          m.branch,
          m.gender,
          m.casteCategory,
          new Date(t.createdAt).toISOString().split('T')[0],
          t.registrationStatus
        ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
        csvRows.push(row);
      });
    });

    const csvContent = csvRows.join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=SIH_2026_Registrations_${Date.now()}.csv`);
    res.status(200).send(csvContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAdminTeams,
  getAdminTeamById,
  updateAdminTeam,
  deleteAdminTeam,
  exportCsv,
};
