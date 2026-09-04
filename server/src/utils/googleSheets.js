/**
 * Google Sheets Real-Time Sync Service
 * Formats team registration records into 13-column rows matching the official Google Sheet:
 * [Team ID, Team Name, Problem Statement ID, Leader Email, Member Role, Student Name, Roll Number, Year, Branch, Gender, Category, Registration Date, Status]
 */

const formatTeamRows = (team) => {
  if (!team || !Array.isArray(team.members)) return [];

  const registrationDate = team.createdAt
    ? new Date(team.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  return team.members.map((m) => [
    team.teamId || '',
    team.teamName || '',
    team.problemStatementId || '',
    team.leaderEmail || '',
    m.isLeader ? 'Leader' : 'Member',
    m.name || '',
    (m.rollNumber || '').toUpperCase(),
    m.year || '',
    m.branch || '',
    m.gender || '',
    m.casteCategory || '',
    registrationDate,
    team.registrationStatus || 'registered',
  ]);
};

/**
 * Appends a newly registered team (6 member rows) to the Google Sheet via Webhook
 */
const appendTeamToSheet = async (team) => {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    return {
      success: false,
      message: 'GOOGLE_SHEET_WEBHOOK_URL not configured.',
    };
  }

  const rows = formatTeamRows(team);
  if (rows.length === 0) return { success: false, message: 'No rows to append' };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'appendRows',
        teamId: team.teamId,
        teamName: team.teamName,
        rows: rows,
      }),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    console.log('[Google Sheets] Synced team ' + (team.teamId || '') + ' (' + rows.length + ' rows) to Google Sheet.');
    return { success: true, data };
  } catch (error) {
    console.error('[Google Sheets] Failed to sync team ' + (team.teamId || '') + ':', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Syncs an array of all teams to the Google Sheet (Full Dump)
 */
const syncAllTeamsToSheet = async (teams) => {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    return {
      success: false,
      message: 'GOOGLE_SHEET_WEBHOOK_URL is not configured in environment variables.',
    };
  }

  let allRows = [];
  teams.forEach((t) => {
    allRows = allRows.concat(formatTeamRows(t));
  });

  if (allRows.length === 0) {
    return { success: false, message: 'No registered teams found to sync.' };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'bulkAppendRows',
        totalTeams: teams.length,
        totalRows: allRows.length,
        rows: allRows,
      }),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return {
      success: true,
      totalTeams: teams.length,
      totalRows: allRows.length,
      data,
    };
  } catch (error) {
    console.error('[Google Sheets] Bulk sync error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  formatTeamRows,
  appendTeamToSheet,
  syncAllTeamsToSheet,
};
