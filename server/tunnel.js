require('dotenv').config();
const { spawn } = require('child_process');
const path = require('path');

const DOMAIN = 'bunny-quote-game.ngrok-free.dev';
const PORT = 5173;

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   🚀 Launching SIH 2026 Public ngrok Tunnel');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`  🌐 Public Student Portal   : https://${DOMAIN}`);
console.log(`  📊 Live Excel Spreadsheet  : https://${DOMAIN}/spreadsheet`);
console.log(`  🔐 Admin Control Login     : https://${DOMAIN}/admin/login`);
console.log(`  🔌 Backend REST API        : https://${DOMAIN}/api`);
console.log(`  ❤  Backend Health Check    : https://${DOMAIN}/api/health`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log(`Connecting ngrok to local frontend on port ${PORT} with domain ${DOMAIN}...\n`);

const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const ngrokProcess = spawn(cmd, ['ngrok', 'http', `--url=${DOMAIN}`, `${PORT}`], {
  stdio: 'inherit',
  shell: true,
});

ngrokProcess.on('error', (err) => {
  console.error('❌ Failed to start ngrok:', err);
});

ngrokProcess.on('close', (code) => {
  console.log(`ngrok process exited with code ${code}`);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Stopping ngrok tunnel...');
  ngrokProcess.kill();
  process.exit(0);
});
