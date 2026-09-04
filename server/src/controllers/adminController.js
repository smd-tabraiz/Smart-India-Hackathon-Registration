const Team = require('../models/Team');
const User = require('../models/User');

// @desc    Get admin statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    const teams = await Team.find();

    const totalTeams = teams.length;
    const totalStudents = totalTeams * 6;

    let femaleParticipants = 0;
    teams.forEach((t) => {
      t.members.forEach((m) => {
        if (m.gender === 'Female') femaleParticipants++;
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

    let teams = await Team.find().sort({ createdAt: -1 });

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

// @desc    Get single team detail
// @route   GET /api/admin/teams/:id
// @access  Private (Admin)
const getAdminTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
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
    const team = await Team.findById(req.params.id);

    if (!team) return res.status(404).json({ message: 'Team not found' });

    if (teamName) team.teamName = teamName.trim();
    if (problemStatementId) team.problemStatementId = problemStatementId.trim().toUpperCase();
    if (registrationStatus) team.registrationStatus = registrationStatus;
    if (members && Array.isArray(members)) team.members = members;

    await team.save();
    res.json({ message: 'Team updated successfully by admin', team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete or Disqualify team by admin
// @route   DELETE /api/admin/teams/:id
// @access  Private (Admin)
const deleteAdminTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    await User.findByIdAndDelete(team.leaderUser);
    await Team.findByIdAndDelete(req.params.id);

    res.json({ message: `Team ${team.teamId} (${team.teamName}) deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export registration data as CSV
// @route   GET /api/admin/export-csv
// @access  Private (Admin)
const exportCsv = async (req, res) => {
  try {
    const teams = await Team.find().sort({ createdAt: -1 });

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
