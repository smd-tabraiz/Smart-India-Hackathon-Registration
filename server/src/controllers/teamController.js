const mongoose = require('mongoose');
const Team = require('../models/Team');
const User = require('../models/User');
const localStore = require('../config/localStore');
const { generateTeamId } = require('../utils/teamIdGenerator');
const { sendRegistrationEmail } = require('../utils/sendGrid');
const { appendTeamToSheet } = require('../utils/googleSheets');
const { generateToken } = require('./authController');

// Helper to check if DB is connected
const isDbConnected = () => mongoose.connection.readyState === 1;

// Helper for validating members array
const validateMembersArray = async (members, currentTeamId = null) => {
  if (!Array.isArray(members) || members.length !== 6) {
    return 'A team must contain EXACTLY 6 members.';
  }

  // 1. Check all required fields
  for (let i = 0; i < members.length; i++) {
    const m = members[i];
    if (!m.name || !m.rollNumber || !m.year || !m.branch || !m.gender || !m.casteCategory) {
      return `Incomplete details for member #${i + 1} (${m.name || 'Unnamed'}). All fields are mandatory.`;
    }
  }

  // 2. Check Female count
  const femaleCount = members.filter((m) => m.gender === 'F' || m.gender === 'Female').length;
  if (femaleCount < 1) {
    return 'Mandatory Rule Violated: At least ONE female student must be present in every team of 6.';
  }

  // 3. Check Team Leader count
  const leaderCount = members.filter((m) => m.isLeader).length;
  if (leaderCount !== 1) {
    return 'Exactly ONE member must be designated as the Team Leader.';
  }

  // 4. Duplicate roll numbers within current team
  const rollNumbers = members.map((m) => m.rollNumber.trim().toUpperCase());
  const uniqueRolls = new Set(rollNumbers);
  if (uniqueRolls.size !== members.length) {
    return 'Duplicate roll numbers found within the team. Each member must have a unique Roll Number.';
  }

  // 5. Duplicate roll numbers across registered teams
  let existingTeams = [];
  if (isDbConnected()) {
    try {
      existingTeams = await Team.find(
        currentTeamId ? { teamId: { $ne: currentTeamId } } : {}
      );
    } catch (err) {
      existingTeams = localStore.getTeams().filter((t) => t.teamId !== currentTeamId);
    }
  } else {
    existingTeams = localStore.getTeams().filter((t) => t.teamId !== currentTeamId);
  }

  // Also include localStore teams if DB had teams
  const localList = localStore.getTeams().filter((t) => t.teamId !== currentTeamId);
  for (const lt of localList) {
    if (!existingTeams.some((et) => et.teamId === lt.teamId)) {
      existingTeams.push(lt);
    }
  }

  for (const team of existingTeams) {
    for (const member of team.members) {
      const existingRoll = member.rollNumber.toUpperCase();
      if (uniqueRolls.has(existingRoll)) {
        return `Roll Number ${existingRoll} is already registered under Team "${team.teamName}" (${team.teamId}).`;
      }
    }
  }

  return null; // validation passed
};

// @desc    Register a new team
// @route   POST /api/teams/register
// @access  Public
const registerTeam = async (req, res) => {
  try {
    const { email, password, teamName, problemStatementId, members } = req.body;

    if (!email || !password || !teamName || !problemStatementId) {
      return res.status(400).json({ message: 'All top-level team and account fields are required.' });
    }

    const formattedEmail = email.toLowerCase().trim();
    const formattedTeamName = teamName.trim();
    const formattedPsId = problemStatementId.trim().toUpperCase();

    // 1. Check if email is already taken
    if (isDbConnected()) {
      try {
        const existingUser = await User.findOne({ email: formattedEmail });
        if (existingUser) {
          return res.status(400).json({ message: 'This email is already registered. Please login or use a different email.' });
        }
        const existingTeam = await Team.findOne({ teamName: new RegExp(`^${formattedTeamName}$`, 'i') });
        if (existingTeam) {
          return res.status(400).json({ message: `Team Name "${teamName}" is already taken.` });
        }
      } catch (err) {
        // Fallback
      }
    }

    const localUser = localStore.findUserByEmail(formattedEmail);
    if (localUser) {
      return res.status(400).json({ message: 'This email is already registered. Please login or use a different email.' });
    }
    const localTeam = localStore.findTeamByName(formattedTeamName);
    if (localTeam) {
      return res.status(400).json({ message: `Team Name "${teamName}" is already taken.` });
    }

    // 2. Validate members array
    const validationError = await validateMembersArray(members);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    // 3. Generate unique server-side Team ID
    let teamId = '';
    if (isDbConnected()) {
      try {
        teamId = await generateTeamId();
      } catch (err) {
        const seqPadded = String(localStore.getTeams().length + 1).padStart(4, '0');
        teamId = `SIH26-CC-${seqPadded}`;
      }
    } else {
      const seqPadded = String(localStore.getTeams().length + 1).padStart(4, '0');
      teamId = `SIH26-CC-${seqPadded}`;
    }

    const formattedMembers = members.map((m) => ({
      name: m.name.trim(),
      rollNumber: m.rollNumber.trim().toUpperCase(),
      year: m.year,
      branch: m.branch,
      gender: m.gender,
      casteCategory: m.casteCategory,
      isLeader: Boolean(m.isLeader),
    }));

    let userObj = null;
    let teamObj = null;

    if (isDbConnected()) {
      try {
        userObj = await User.create({
          email: formattedEmail,
          password,
          role: 'leader',
          teamId,
        });

        teamObj = await Team.create({
          teamId,
          teamName: formattedTeamName,
          problemStatementId: formattedPsId,
          leaderUser: userObj._id,
          leaderEmail: userObj.email,
          members: formattedMembers,
          registrationStatus: 'registered',
          emailSent: false,
        });
      } catch (err) {
        console.error('MongoDB write failed, using localStore:', err.message);
        userObj = null;
        teamObj = null;
      }
    }

    if (!userObj || !teamObj) {
      userObj = await localStore.addUser({
        email: formattedEmail,
        password,
        role: 'leader',
        teamId,
      });

      teamObj = localStore.addTeam({
        teamId,
        teamName: formattedTeamName,
        problemStatementId: formattedPsId,
        leaderUser: userObj._id,
        leaderEmail: userObj.email,
        members: formattedMembers,
        registrationStatus: 'registered',
        emailSent: false,
      });
    } else {
      // Sync backup to localStore
      await localStore.addUser({
        _id: String(userObj._id),
        email: formattedEmail,
        password,
        role: 'leader',
        teamId,
      });
      localStore.addTeam({
        _id: String(teamObj._id),
        teamId,
        teamName: formattedTeamName,
        problemStatementId: formattedPsId,
        leaderUser: String(userObj._id),
        leaderEmail: userObj.email,
        members: formattedMembers,
        registrationStatus: 'registered',
        emailSent: false,
        createdAt: teamObj.createdAt,
      });
    }

    // 4. Send confirmation email
    const emailResult = await sendRegistrationEmail(teamObj);
    if (emailResult.success && isDbConnected()) {
      teamObj.emailSent = true;
      await teamObj.save();
    } else if (emailResult.success) {
      teamObj.emailSent = true;
    }

    // 5. Trigger real-time Google Sheet sync
    appendTeamToSheet(teamObj).catch((err) => {
      console.warn('[Google Sheets] Async append notice:', err.message);
    });

    // 6. Generate JWT Token
    const token = generateToken(userObj._id, userObj.role, userObj.email);

    res.status(201).json({
      message: 'Team registered successfully!',
      teamId: teamObj.teamId,
      team: teamObj,
      user: {
        _id: userObj._id,
        email: userObj.email,
        role: userObj.role,
        teamId: userObj.teamId,
      },
      token,
      emailSent: emailResult.success,
      emailMethod: emailResult.method,
      emailPreviewUrl: emailResult.previewUrl || null,
      whatsappGroupLink: process.env.WHATSAPP_GROUP_LINK || 'https://chat.whatsapp.com/SIH2026CodersClubCIE',
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration.' });
  }
};

// @desc    Get logged in leader's team
// @route   GET /api/teams/my-team
// @access  Private (Leader)
const getMyTeam = async (req, res) => {
  try {
    let team = null;
    if (isDbConnected()) {
      try {
        team = await Team.findOne({ leaderUser: req.user._id });
      } catch (err) {
        team = null;
      }
    }
    if (!team) {
      team = localStore.findTeamByLeaderIdOrEmail(req.user._id, req.user.email);
    }

    if (!team) {
      return res.status(404).json({ message: 'No registered team found for this account.' });
    }
    res.json({
      team,
      whatsappGroupLink: process.env.WHATSAPP_GROUP_LINK || 'https://chat.whatsapp.com/EIoDz1GewoZLVXYJEdfR0t?s=sw&p=a&mlu=4&ilr=4',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Edit logged in leader's team
// @route   PUT /api/teams/my-team
// @access  Private (Leader)
const updateMyTeam = async (req, res) => {
  try {
    let team = null;
    if (isDbConnected()) {
      try {
        team = await Team.findOne({ leaderUser: req.user._id });
      } catch (err) {
        team = null;
      }
    }
    if (!team) {
      team = localStore.findTeamByLeaderIdOrEmail(req.user._id, req.user.email);
    }

    if (!team) {
      return res.status(404).json({ message: 'No registered team found for this account.' });
    }

    const { teamName, problemStatementId, members } = req.body;

    if (teamName && teamName.trim() !== team.teamName) {
      team.teamName = teamName.trim();
    }

    if (problemStatementId) {
      team.problemStatementId = problemStatementId.trim().toUpperCase();
    }

    if (members) {
      const validationError = await validateMembersArray(members, team.teamId);
      if (validationError) {
        return res.status(400).json({ message: validationError });
      }
      team.members = members.map((m) => ({
        name: m.name.trim(),
        rollNumber: m.rollNumber.trim().toUpperCase(),
        year: m.year,
        branch: m.branch,
        gender: m.gender,
        casteCategory: m.casteCategory,
        isLeader: Boolean(m.isLeader),
      }));
    }

    if (isDbConnected() && typeof team.save === 'function') {
      try {
        await team.save();
      } catch (err) {
        console.error('Mongo save failed:', err.message);
      }
    }

    // Also update localStore
    localStore.updateTeam(team.teamId, {
      teamName: team.teamName,
      problemStatementId: team.problemStatementId,
      members: team.members,
    });

    res.json({ message: 'Team details updated successfully!', team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerTeam,
  getMyTeam,
  updateMyTeam,
};
