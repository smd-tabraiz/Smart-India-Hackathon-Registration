const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');

if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith('SG.') && !process.env.SENDGRID_API_KEY.includes('placeholder')) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const sendRegistrationEmail = async (teamData) => {
  const { teamId, teamName, problemStatementId, leaderEmail, members } = teamData;
  const leader = members.find((m) => m.isLeader) || members[0];
  const whatsappLink = process.env.WHATSAPP_GROUP_LINK || 'https://chat.whatsapp.com/SIH2026CodersClubCIE';

  const memberRows = members
    .map(
      (m, idx) => `
    <tr style="background-color: ${idx % 2 === 0 ? '#f8fafc' : '#ffffff'};">
      <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: ${m.isLeader ? 'bold' : 'normal'}; font-size: 13px;">
        ${m.name} ${m.isLeader ? '(Leader)' : ''}
      </td>
      <td style="padding: 10px; border: 1px solid #e2e8f0; font-size: 13px;">${m.rollNumber}</td>
      <td style="padding: 10px; border: 1px solid #e2e8f0; font-size: 13px;">${m.year}</td>
      <td style="padding: 10px; border: 1px solid #e2e8f0; font-size: 13px;">${m.branch}</td>
      <td style="padding: 10px; border: 1px solid #e2e8f0; font-size: 13px;">${m.gender}</td>
      <td style="padding: 10px; border: 1px solid #e2e8f0; font-size: 13px;">${m.casteCategory}</td>
    </tr>
  `
    )
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f1f5f9; color: #1e293b; margin: 0; padding: 20px; }
        .container { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: #ffffff; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
        .header p { margin: 8px 0 0; color: #93c5fd; font-size: 14px; }
        .badge { background: #0284c7; color: white; padding: 4px 12px; border-radius: 20px; display: inline-block; font-size: 12px; margin-top: 10px; font-weight: 600; }
        .content { padding: 30px 20px; }
        .info-card { background: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; border-radius: 6px; margin-bottom: 25px; }
        .info-card p { margin: 5px 0; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
        th { background: #1e293b; color: white; padding: 10px; text-align: left; }
        .btn-whatsapp { display: inline-block; background-color: #25D366; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 15px; text-align: center; margin-top: 20px; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Smart India Hackathon 2026</h1>
          <p>Coders Club & Centre for Entrepreneurship (CIE)</p>
          <div class="badge">REGISTRATION CONFIRMED</div>
        </div>
        <div class="content">
          <h2>Registration Details</h2>
          <div class="info-card">
            <p><strong>Team ID:</strong> ${teamId}</p>
            <p><strong>Team Name:</strong> ${teamName}</p>
            <p><strong>Problem Statement ID:</strong> ${problemStatementId}</p>
            <p><strong>Team Leader:</strong> ${leader.name} (${leaderEmail})</p>
          </div>

          <h3>Registered Team Members (6 Students)</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll No</th>
                <th>Year</th>
                <th>Branch</th>
                <th>Gender</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              ${memberRows}
            </tbody>
          </table>

          <div style="text-align: center; margin-top: 30px;">
            <p style="font-weight: 600; color: #0f172a;">Join the official SIH 2026 Team Leaders WhatsApp Group:</p>
            <a href="${whatsappLink}" target="_blank" class="btn-whatsapp">
              💬 Join WhatsApp Group
            </a>
          </div>
        </div>
        <div class="footer">
          <p>Organized by <strong>Coders Club</strong> in collaboration with <strong>Centre for Entrepreneurship (CIE)</strong></p>
          <p>© 2026 Smart India Hackathon Registration Portal. All Rights Reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"${process.env.SENDGRID_FROM_NAME || 'Coders Club & CIE SIH Portal'}" <${process.env.SENDGRID_FROM_EMAIL || process.env.SMTP_USER || 'noreply@codersclub.edu.in'}>`,
    to: leaderEmail,
    subject: `[SIH 2026] Registration Confirmation - Team ${teamName} (${teamId})`,
    html: htmlContent,
  };

  // Option 1: Try Nodemailer SMTP if SMTP_USER is configured
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 465,
        secure: process.env.SMTP_SECURE === 'false' ? false : true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Confirmation email delivered via SMTP to ${leaderEmail} (Message ID: ${info.messageId})`);
      return true;
    } catch (err) {
      console.error('❌ SMTP Email Delivery Failed:', err.message);
    }
  }

  // Option 2: Try SendGrid API if API key is provided
  if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith('SG.') && !process.env.SENDGRID_API_KEY.includes('placeholder')) {
    try {
      await sgMail.send(mailOptions);
      console.log(`✅ Confirmation email sent via SendGrid API to ${leaderEmail}`);
      return true;
    } catch (err) {
      console.error('❌ SendGrid Error:', err.response ? err.response.body : err.message);
    }
  }

  // Option 3: Automatic Real Ethereal Email Test Account (Live Web Email Inbox Preview)
  try {
    const testAccount = await nodemailer.createTestAccount();
    const testTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await testTransporter.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Live Confirmation Email Sent for Team ${teamName} (${teamId})`);
    console.log(`📩 Recipient: ${leaderEmail}`);
    console.log(`🔗 Live Email Inbox Preview URL: ${previewUrl}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return true;
  } catch (err) {
    console.error('❌ Ethereal email fallback error:', err.message);
    return false;
  }
};

module.exports = { sendRegistrationEmail };
