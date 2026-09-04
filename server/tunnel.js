require('dotenv').config();
const ngrok = require('ngrok');
const fs = require('fs');
const path = require('path');

const FRONTEND_PORT = 5173;
const AUTHTOKEN = process.env.NGROK_AUTHTOKEN;

(async () => {
  try {
    console.log('🚀 Starting ngrok public tunnel...\n');

    const publicUrl = await ngrok.connect({
      addr: FRONTEND_PORT,
      authtoken: AUTHTOKEN,
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   SIH 2026 Registration Portal — Live Public URLs');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  🌐 Public Student Portal   : ${publicUrl}`);
    console.log(`  📊 Live Excel Spreadsheet  : ${publicUrl}/spreadsheet`);
    console.log(`  🔐 Admin Control Login     : ${publicUrl}/admin/login`);
    console.log(`  🔌 Backend REST API        : ${publicUrl}/api`);
    console.log(`  ❤  Backend Health Check    : ${publicUrl}/api/health`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📋 Share the Public Student Portal URL with your students.');
    console.log('⚠  Keep this terminal window running to maintain public access.\n');

    // Update .env CLIENT_URL
    const envPath = path.join(__dirname, '.env');
    let envContent = fs.readFileSync(envPath, 'utf-8');
    const updatedEnv = envContent.replace(/^CLIENT_URL=.*/m, `CLIENT_URL=${publicUrl}`);
    fs.writeFileSync(envPath, updatedEnv, 'utf-8');

    process.on('SIGINT', async () => {
      console.log('\n🛑 Stopping ngrok tunnel...');
      await ngrok.kill();
      const envContent2 = fs.readFileSync(envPath, 'utf-8');
      const restored = envContent2.replace(/^CLIENT_URL=.*/m, 'CLIENT_URL=http://localhost:5173');
      fs.writeFileSync(envPath, restored, 'utf-8');
      console.log('✅ Tunnel stopped. CLIENT_URL restored to localhost.');
      process.exit(0);
    });

  } catch (err) {
    console.error('\n❌ ngrok error:', err.message || err);
    process.exit(1);
  }
})();
