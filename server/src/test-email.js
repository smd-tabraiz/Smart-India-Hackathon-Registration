require('dotenv').config();
const { sendRegistrationEmail } = require('./utils/sendGrid');

(async () => {
  console.log('Testing email delivery utility...\n');
  const success = await sendRegistrationEmail({
    teamId: 'SIH26-CC-9999',
    teamName: 'CyberKnights SIH',
    problemStatementId: 'SIH1001',
    leaderEmail: 'leader.test@gmail.com',
    members: [
      { name: 'Alice Smith', rollNumber: '21CS001', year: '3rd Year', branch: 'CSE', gender: 'Female', casteCategory: 'GEN', isLeader: true },
      { name: 'Bob Jones', rollNumber: '21CS002', year: '3rd Year', branch: 'IT', gender: 'Male', casteCategory: 'BC', isLeader: false },
      { name: 'Charlie Brown', rollNumber: '21CS003', year: '3rd Year', branch: 'ECE', gender: 'Male', casteCategory: 'GEN', isLeader: false },
      { name: 'David Lee', rollNumber: '21CS004', year: '3rd Year', branch: 'AI & DS', gender: 'Male', casteCategory: 'EWS', isLeader: false },
      { name: 'Eve Davis', rollNumber: '21CS005', year: '3rd Year', branch: 'EEE', gender: 'Male', casteCategory: 'GEN', isLeader: false },
      { name: 'Frank Wilson', rollNumber: '21CS006', year: '3rd Year', branch: 'Civil', gender: 'Male', casteCategory: 'OC', isLeader: false }
    ]
  });

  console.log('Email delivery result:', success);
  process.exit(0);
})();
