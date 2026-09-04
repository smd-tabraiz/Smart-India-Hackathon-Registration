const http = require('http');

const data = JSON.stringify({
  email: "testleader@gmail.com",
  password: "LeaderPassword123",
  teamName: "TestTeamCyber",
  problemStatementId: "SIH1001",
  members: [
    { name: "Alice", rollNumber: "21CS001", year: "3rd Year", branch: "CSE", gender: "Female", casteCategory: "GEN", isLeader: true },
    { name: "Bob", rollNumber: "21CS002", year: "3rd Year", branch: "CSE", gender: "Male", casteCategory: "GEN", isLeader: false },
    { name: "Charlie", rollNumber: "21CS003", year: "3rd Year", branch: "IT", gender: "Male", casteCategory: "BC", isLeader: false },
    { name: "David", rollNumber: "21CS004", year: "3rd Year", branch: "ECE", gender: "Male", casteCategory: "OC", isLeader: false },
    { name: "Eve", rollNumber: "21CS005", year: "3rd Year", branch: "CSE", gender: "Male", casteCategory: "GEN", isLeader: false },
    { name: "Frank", rollNumber: "21CS006", year: "3rd Year", branch: "EEE", gender: "Male", casteCategory: "EWS", isLeader: false }
  ]
});

const req = http.request({
  hostname: 'localhost',
  port: 5005,
  path: '/api/teams/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response Body:', body);
  });
});

req.on('error', (err) => {
  console.error('Request Error:', err);
});

req.write(data);
req.end();
