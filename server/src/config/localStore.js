const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial store state
let store = {
  users: [],
  teams: [],
};

// Load from disk if exists
if (fs.existsSync(DATA_FILE)) {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    store = JSON.parse(raw);
    if (!Array.isArray(store.users)) store.users = [];
    if (!Array.isArray(store.teams)) store.teams = [];
  } catch (err) {
    console.error('Failed to parse local store, starting fresh:', err.message);
  }
}

const saveStore = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write to local store:', err.message);
  }
};

const localStore = {
  getUsers: () => store.users,
  getTeams: () => store.teams,

  findUserByEmail: (email) => {
    if (!email) return null;
    return store.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
  },

  findUserById: (id) => {
    if (!id) return null;
    return store.users.find((u) => String(u._id) === String(id)) || null;
  },

  addUser: async (userData) => {
    let hashedPassword = userData.password;
    if (!hashedPassword.startsWith('$2')) {
      hashedPassword = await bcrypt.hash(userData.password, 10);
    }
    const newUser = {
      _id: userData._id || ('user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7)),
      email: userData.email.toLowerCase().trim(),
      password: hashedPassword,
      role: userData.role || 'leader',
      teamId: userData.teamId,
      createdAt: new Date().toISOString(),
    };
    
    const idx = store.users.findIndex((u) => u.email === newUser.email);
    if (idx !== -1) {
      store.users[idx] = newUser;
    } else {
      store.users.push(newUser);
    }
    saveStore();
    return newUser;
  },

  findTeamByLeaderIdOrEmail: (leaderId, email) => {
    return store.teams.find((t) => 
      (leaderId && String(t.leaderUser) === String(leaderId)) || 
      (email && t.leaderEmail.toLowerCase() === email.toLowerCase().trim())
    ) || null;
  },

  findTeamById: (idOrTeamId) => {
    if (!idOrTeamId) return null;
    const target = String(idOrTeamId).trim().toUpperCase();
    return store.teams.find((t) => 
      String(t._id) === String(idOrTeamId).trim() || 
      t.teamId.toUpperCase() === target
    ) || null;
  },

  findTeamByName: (teamName) => {
    if (!teamName) return null;
    return store.teams.find((t) => t.teamName.toLowerCase() === teamName.toLowerCase().trim()) || null;
  },

  addTeam: (teamData) => {
    const newTeam = {
      _id: teamData._id || ('team_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7)),
      teamId: teamData.teamId,
      teamName: teamData.teamName.trim(),
      problemStatementId: teamData.problemStatementId.trim().toUpperCase(),
      leaderUser: teamData.leaderUser,
      leaderEmail: teamData.leaderEmail.toLowerCase().trim(),
      members: teamData.members,
      registrationStatus: teamData.registrationStatus || 'registered',
      emailSent: Boolean(teamData.emailSent),
      createdAt: teamData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const idx = store.teams.findIndex((t) => t.teamId === newTeam.teamId);
    if (idx !== -1) {
      store.teams[idx] = newTeam;
    } else {
      store.teams.push(newTeam);
    }
    saveStore();
    return newTeam;
  },

  updateTeam: (idOrTeamId, updates) => {
    if (!idOrTeamId) return null;
    const target = String(idOrTeamId).trim().toUpperCase();
    const idx = store.teams.findIndex((t) => 
      String(t._id) === String(idOrTeamId).trim() || 
      t.teamId.toUpperCase() === target
    );
    if (idx !== -1) {
      store.teams[idx] = { ...store.teams[idx], ...updates, updatedAt: new Date().toISOString() };
      saveStore();
      return store.teams[idx];
    }
    return null;
  },

  deleteTeam: (idOrTeamId) => {
    if (!idOrTeamId) return null;
    const target = String(idOrTeamId).trim().toUpperCase();
    const idx = store.teams.findIndex((t) => 
      String(t._id) === String(idOrTeamId).trim() || 
      t.teamId.toUpperCase() === target
    );
    if (idx !== -1) {
      const removedTeam = store.teams.splice(idx, 1)[0];
      // Also remove associated user
      const userIdx = store.users.findIndex((u) => 
        String(u._id) === String(removedTeam.leaderUser) || 
        (removedTeam.leaderEmail && u.email.toLowerCase() === removedTeam.leaderEmail.toLowerCase())
      );
      if (userIdx !== -1) {
        store.users.splice(userIdx, 1);
      }
      saveStore();
      return removedTeam;
    }
    return null;
  },

  comparePassword: async (plainPassword, hashedPassword) => {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (err) {
      return false;
    }
  },
};

module.exports = localStore;
