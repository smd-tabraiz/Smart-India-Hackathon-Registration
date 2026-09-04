const Team = require('../models/Team');

const generateTeamId = async () => {
  try {
    const count = await Team.countDocuments();
    const nextSeq = count + 1;
    const padded = String(nextSeq).padStart(4, '0');
    return `SIH26-CC-${padded}`;
  } catch (error) {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `SIH26-CC-${random}`;
  }
};

module.exports = { generateTeamId };
