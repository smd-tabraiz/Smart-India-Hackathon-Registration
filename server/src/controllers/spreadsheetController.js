const mongoose = require('mongoose');
const Team = require('../models/Team');
const localStore = require('../config/localStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get matrix grid data for live Excel sheet
// @route   GET /api/spreadsheet/data
// @access  Public (Shareable link)
const getSpreadsheetData = async (req, res) => {
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

    const rows = [];
    let rowId = 1;

    teams.forEach((t) => {
      if (Array.isArray(t.members) && t.members.length > 0) {
        t.members.forEach((m) => {
          rows.push({
            id: rowId++,
            dbTeamId: t._id,
            teamId: t.teamId,
            teamName: t.teamName,
            problemStatementId: t.problemStatementId,
            leaderEmail: t.leaderEmail,
            studentName: m.name,
            rollNumber: m.rollNumber,
            year: m.year,
            branch: m.branch,
            gender: m.gender,
            casteCategory: m.casteCategory,
            role: m.isLeader ? 'Leader' : 'Member',
            registrationStatus: t.registrationStatus,
            updatedAt: t.updatedAt || t.createdAt || new Date().toISOString(),
          });
        });
      }
    });

    // Add extra 10 blank rows for manual spreadsheet editing
    for (let i = 1; i <= 10; i++) {
      rows.push({
        id: rowId++,
        dbTeamId: null,
        teamId: '',
        teamName: '',
        problemStatementId: '',
        leaderEmail: '',
        studentName: '',
        rollNumber: '',
        year: '',
        branch: '',
        gender: '',
        casteCategory: '',
        role: '',
        registrationStatus: '',
        updatedAt: '',
      });
    }

    res.json({
      success: true,
      totalRows: rows.length,
      columns: [
        { key: 'teamId', label: 'Team ID' },
        { key: 'teamName', label: 'Team Name' },
        { key: 'problemStatementId', label: 'Problem Statement ID' },
        { key: 'leaderEmail', label: 'Leader Email' },
        { key: 'role', label: 'Role' },
        { key: 'studentName', label: 'Student Name' },
        { key: 'rollNumber', label: 'Roll Number' },
        { key: 'year', label: 'Year' },
        { key: 'branch', label: 'Branch' },
        { key: 'gender', label: 'Gender' },
        { key: 'casteCategory', label: 'Category' },
        { key: 'registrationStatus', label: 'Status' }
      ],
      data: rows
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Sync edited live spreadsheet matrix data back to MongoDB
// @route   POST /api/spreadsheet/sync
// @access  Public (Shareable link)
const syncSpreadsheetData = async (req, res) => {
  try {
    const { rows } = req.body;

    if (!Array.isArray(rows)) {
      return res.status(400).json({ success: false, message: 'Invalid rows data payload' });
    }

    // Filter out completely blank rows
    const validRows = rows.filter(r => r.teamId || r.teamName || r.studentName || r.rollNumber);

    if (isDbConnected()) {
      // Group rows by teamId / dbTeamId
      const teamGroups = {};
      validRows.forEach(r => {
        const tid = r.teamId || 'NEW_TEAM';
        if (!teamGroups[tid]) {
          teamGroups[tid] = {
            teamId: r.teamId,
            teamName: r.teamName,
            problemStatementId: r.problemStatementId,
            leaderEmail: r.leaderEmail,
            registrationStatus: r.registrationStatus || 'registered',
            members: []
          };
        }
        teamGroups[tid].members.push({
          name: r.studentName || 'Student',
          rollNumber: (r.rollNumber || '').toUpperCase(),
          year: r.year || '3rd Year',
          branch: r.branch || 'CSE',
          gender: r.gender || 'Male',
          casteCategory: r.casteCategory || 'GEN',
          isLeader: r.role === 'Leader'
        });
      });

      // Update existing teams in DB
      for (const tid of Object.keys(teamGroups)) {
        const group = teamGroups[tid];
        if (group.teamId) {
          await Team.findOneAndUpdate(
            { teamId: group.teamId },
            {
              teamName: group.teamName,
              problemStatementId: group.problemStatementId,
              registrationStatus: group.registrationStatus,
              members: group.members
            },
            { upsert: false }
          );
        }
      }
    }

    res.json({
      success: true,
      message: 'Real-time Excel spreadsheet data synced to MongoDB successfully!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSpreadsheetData,
  syncSpreadsheetData
};
