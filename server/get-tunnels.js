const http = require('http');

http.get('http://127.0.0.1:4040/api/tunnels', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      console.log('ACTIVE TUNNELS:', JSON.stringify(data, null, 2));
    } catch (e) {
      console.log('Raw output:', body);
    }
  });
}).on('error', err => {
  console.log('No local ngrok process running on 4040:', err.message);
});
