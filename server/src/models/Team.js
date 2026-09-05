const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  rollNumber: { type: String, required: true, trim: true, uppercase: true },
  year: { 
    type: String, 
    required: true, 
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year'] 
  },
  branch: { 
    type: String, 
    required: true, 
    enum: ['CSE', 'CSE - (AI & ML)', 'CSE - (DS)', 'CSBS', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AI & DS', 'AI & ML', 'Mechanical', 'Civil', 'Other'] 
  },
  gender: { 
    type: String, 
    required: true, 
    enum: ['M', 'F', 'Male', 'Female', 'Other'] 
  },
  casteCategory: { 
    type: String, 
    required: true, 
    enum: ['GEN', 'EWS', 'OC', 'BC', 'SC', 'ST', 'sc', 'st', 'bc'] 
  },
  isLeader: { type: Boolean, default: false }
});

const teamSchema = new mongoose.Schema(
  {
    teamId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    teamName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    problemStatementId: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    leaderUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    leaderEmail: {
      type: String,
      required: true,
      lowercase: true,
    },
    members: {
      type: [memberSchema],
      validate: [
        {
          validator: function (members) {
            return members.length === 6;
          },
          message: 'A team must contain EXACTLY 6 members.',
        },
        {
          validator: function (members) {
            const femaleCount = members.filter((m) => m.gender === 'F' || m.gender === 'Female').length;
            return femaleCount >= 1;
          },
          message: 'At least ONE female student must be present in every team of 6.',
        },
        {
          validator: function (members) {
            const leaders = members.filter((m) => m.isLeader);
            return leaders.length === 1;
          },
          message: 'Exactly one team leader must be specified among the 6 members.',
        },
      ],
    },
    registrationStatus: {
      type: String,
      enum: ['registered', 'disqualified', 'pending'],
      default: 'registered',
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Team', teamSchema);
