const http = require('http');

const data = JSON.stringify({
  email: "admin@codersclub.edu.in",
  password: "AdminSIH2026!Secure"
});

const req = http.request({
  hostname: 'localhost',
  port: 5005,
  path: '/api/auth/admin-login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Admin Login Status Code:', res.statusCode);
    console.log('Admin Login Response:', body);
  });
});

req.on('error', (err) => {
  console.error('Request Error:', err);
});

req.write(data);
req.end();
