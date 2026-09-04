import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  FileSpreadsheet, Save, Download, Share2, Plus, Search, RefreshCw, 
  CheckCircle2, AlertCircle, Copy, Grid, Layers, Sparkles, Smartphone, Table, ExternalLink 
} from 'lucide-react';

const COLUMNS = [
  { key: 'teamId', name: 'Team ID', letter: 'A', width: 'min-w-[130px]' },
  { key: 'teamName', name: 'Team Name', letter: 'B', width: 'min-w-[160px]' },
  { key: 'problemStatementId', name: 'PS ID', letter: 'C', width: 'min-w-[120px]' },
  { key: 'leaderEmail', name: 'Leader Email', letter: 'D', width: 'min-w-[180px]' },
  { key: 'role', name: 'Role', letter: 'E', width: 'min-w-[100px]' },
  { key: 'studentName', name: 'Student Name', letter: 'F', width: 'min-w-[160px]' },
  { key: 'rollNumber', name: 'Roll Number', letter: 'G', width: 'min-w-[130px]' },
  { key: 'year', name: 'Year', letter: 'H', width: 'min-w-[110px]' },
  { key: 'branch', name: 'Branch', letter: 'I', width: 'min-w-[110px]' },
  { key: 'gender', name: 'Gender', letter: 'J', width: 'min-w-[100px]' },
  { key: 'casteCategory', name: 'Category', letter: 'K', width: 'min-w-[100px]' },
  { key: 'registrationDate', name: 'Registration Date', letter: 'L', width: 'min-w-[160px]' },
  { key: 'registrationStatus', name: 'Status', letter: 'M', width: 'min-w-[110px]' },
];

const LiveSpreadsheet = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCell, setActiveCell] = useState({ rowIdx: 0, colKey: 'teamName' });
  const [syncStatus, setSyncStatus] = useState('Synced with MongoDB');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedTsv, setCopiedTsv] = useState(false);
  const [copiedFormula, setCopiedFormula] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [pushingToSheets, setPushingToSheets] = useState(false);
  const [pushResult, setPushResult] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'mobile-cards'

  const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1LHSq7l3zEeAtCKd8ZfqyDA7RJFcyMR541cljhQClUGY/edit?usp=sharing';
  const LIVE_CSV_URL = `${window.location.origin}/api/spreadsheet/live-csv`;
  const IMPORTDATA_FORMULA = `=IMPORTDATA("${LIVE_CSV_URL}")`;

  const handleCopyFormula = () => {
    navigator.clipboard.writeText(IMPORTDATA_FORMULA);
    setCopiedFormula(true);
    setTimeout(() => setCopiedFormula(false), 3000);
  };

  const handlePushToGoogleSheet = async () => {
    setPushingToSheets(true);
    setPushResult(null);
    try {
      const res = await API.post('/spreadsheet/dump-to-google-sheet');
      if (res.data && res.data.success) {
        setPushResult({
          type: 'success',
          message: `Successfully synced ${res.data.totalTeams || 0} teams (${res.data.totalRows || 0} rows) to Google Sheet!`,
        });
      } else {
        setPushResult({
          type: 'error',
          message: res.data?.message || 'Please configure GOOGLE_SHEET_WEBHOOK_URL or use the =IMPORTDATA formula in your Google Sheet.',
        });
      }
    } catch (err) {
      setPushResult({
        type: 'error',
        message: err.response?.data?.message || 'Error communicating with server.',
      });
    } finally {
      setPushingToSheets(false);
    }
  };

  const handleCopyTsvForGoogleSheets = () => {
    if (data.length === 0) return;
    const headers = COLUMNS.map((c) => c.name).join('\t');
    const rows = data.map((r) =>
      COLUMNS.map((c) => (r[c.key] !== undefined && r[c.key] !== null ? String(r[c.key]).replace(/\t/g, ' ') : '')).join('\t')
    );
    const tsvContent = [headers, ...rows].join('\n');
    navigator.clipboard.writeText(tsvContent);
    setCopiedTsv(true);
    setTimeout(() => setCopiedTsv(false), 3000);
  };

  const fetchSpreadsheetData = async () => {
    setLoading(true);
    try {
      const res = await API.get('/spreadsheet/data');
      if (res.data && res.data.data) {
        setData(res.data.data);
      }
      setSyncStatus('Synced with MongoDB');
    } catch (err) {
      console.error('Failed to load spreadsheet data:', err);
      setSyncStatus('Sync Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpreadsheetData();
  }, []);

  const handleCellChange = (rowIdx, colKey, value) => {
    const updated = [...data];
    updated[rowIdx] = { ...updated[rowIdx], [colKey]: value };
    setData(updated);
    setSyncStatus('Unsaved Changes');
  };

  const handleAddRow = () => {
    const newRowId = data.length + 1;
    const newRow = {
      id: newRowId,
      dbTeamId: null,
      teamId: '',
      teamName: '',
      problemStatementId: '',
      leaderEmail: '',
      studentName: '',
      rollNumber: '',
      year: '3rd Year',
      branch: 'CSE',
      gender: 'M',
      casteCategory: 'GEN',
      role: 'Member',
      registrationStatus: 'registered',
    };
    setData([newRow, ...data]);
    setSyncStatus('Unsaved Changes');
  };

  const handleSyncToBackend = async () => {
    setSaving(true);
    setSyncStatus('Saving to MongoDB...');
    try {
      await API.post('/spreadsheet/sync', { rows: data });
      setSyncStatus('Synced with MongoDB');
    } catch (err) {
      console.error('Save error:', err);
      setSyncStatus('Error saving data');
    } finally {
      setSaving(false);
    }
  };

  const handleCopyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleExportCsv = () => {
    if (data.length === 0) return;
    const headers = COLUMNS.map((c) => `"${c.name}"`).join(',');
    const rows = data.map((r) =>
      COLUMNS.map((c) => `"${(r[c.key] || '').toString().replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SIH_2026_Live_Spreadsheet_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const filteredData = data.filter((row) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (row.teamId && row.teamId.toLowerCase().includes(q)) ||
      (row.teamName && row.teamName.toLowerCase().includes(q)) ||
      (row.studentName && row.studentName.toLowerCase().includes(q)) ||
      (row.rollNumber && row.rollNumber.toLowerCase().includes(q)) ||
      (row.problemStatementId && row.problemStatementId.toLowerCase().includes(q))
    );
  });

  const activeRowObj = data[activeCell.rowIdx] || {};
  const activeColObj = COLUMNS.find((c) => c.key === activeCell.colKey) || COLUMNS[0];
  const activeCellValue = activeRowObj[activeCell.colKey] || '';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* MOBILE-OPTIMIZED RIBBON TOOLBAR */}
      <div className="bg-slate-900 border-b border-slate-800 p-3 sm:p-4 sticky top-16 z-40 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Header Branding & Mobile Mode Switch */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">Live Excel Sheet</h1>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Real-time
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Mobile-optimized collaborative grid</p>
              </div>
            </div>

            {/* Mobile View Toggle Switch */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 md:hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white shadow' : 'text-slate-400'
                }`}
                title="Spreadsheet Grid View"
              >
                <Table className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('mobile-cards')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'mobile-cards' ? 'bg-blue-600 text-white shadow' : 'text-slate-400'
                }`}
                title="Mobile Cards View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Actions Button Bar */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
            <button
              onClick={handleCopyShareLink}
              className="bg-slate-800 hover:bg-slate-700 text-cyan-400 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 border border-slate-700"
            >
              {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied!' : 'Share Link'}</span>
            </button>

            <button
              onClick={handleAddRow}
              className="bg-slate-800 hover:bg-slate-700 text-blue-400 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 border border-slate-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Row</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="bg-slate-800 hover:bg-slate-700 text-amber-400 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleCopyTsvForGoogleSheets}
              className="bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 border border-indigo-500/40 shadow-sm"
              title="Copy all rows to clipboard formatted for 1-click paste into Google Sheets"
            >
              {copiedTsv ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTsv ? 'Copied for Sheets!' : 'Copy for Sheets'}</span>
            </button>

            <a
              href={GOOGLE_SHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 border border-emerald-500/40 shadow-sm"
              title="Open the official Google Sheet in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Google Sheet ↗</span>
            </a>

            <button
              onClick={() => setShowSyncModal(true)}
              className="bg-teal-600/30 hover:bg-teal-600/40 text-teal-300 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 border border-teal-500/40 shadow-sm"
              title="Configure live sync with Google Sheet"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Auto-Sync Setup</span>
            </button>

            <button
              onClick={handleSyncToBackend}
              disabled={saving}
              className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Mongo'}</span>
            </button>
          </div>
        </div>

        {/* FORMULA BAR & SEARCH */}
        <div className="max-w-7xl mx-auto mt-3 grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
          
          {/* Active Cell Formula Editor */}
          <div className="md:col-span-3 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 flex items-center space-x-2">
            <span className="font-mono text-cyan-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-700 text-[11px]">
              {activeColObj.letter}{activeCell.rowIdx + 1}
            </span>
            <span className="text-slate-500 text-xs">fx</span>
            <input
              type="text"
              value={activeCellValue}
              onChange={(e) => handleCellChange(activeCell.rowIdx, activeCell.colKey, e.target.value)}
              placeholder="Tap cell or type value here..."
              className="w-full bg-transparent text-white font-mono text-xs focus:outline-none placeholder-slate-600"
            />
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Filter sheet rows..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

      </div>

      {/* GOOGLE SHEETS LIVE SYNC NOTIFICATION BANNER */}
      <div className="bg-emerald-950/40 border-b border-emerald-500/20 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 text-emerald-300">
            <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              <strong>Auto-Sync with Google Sheets:</strong> View all registrations live in Google Sheet using formula or instant push.
            </span>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={handleCopyFormula}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1 rounded-lg text-[11px] flex items-center space-x-1.5 transition-all shadow-sm"
              title="Copy =IMPORTDATA formula for Google Sheets cell A1"
            >
              {copiedFormula ? <CheckCircle2 className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
              <span>{copiedFormula ? 'Formula Copied!' : 'Copy =IMPORTDATA Formula'}</span>
            </button>
            <button
              onClick={() => setShowSyncModal(true)}
              className="bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold px-3 py-1 rounded-lg text-[11px] border border-slate-700 transition-all"
            >
              Sync Guide
            </button>
          </div>
        </div>
      </div>

      {/* SPREADSHEET MAIN CONTAINER */}
      <div className="flex-grow p-2 sm:p-4 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
            <RefreshCw className="w-6 h-6 animate-spin mr-2 text-cyan-400" />
            <span>Loading live spreadsheet rows...</span>
          </div>
        ) : viewMode === 'mobile-cards' ? (
          
          /* MOBILE TOUCH CARDS VIEW MODE */
          <div className="space-y-4 md:hidden">
            {filteredData.map((row, rowIdx) => (
              <div key={row.id || rowIdx} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-mono text-xs text-cyan-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    Row #{rowIdx + 1}
                  </span>
                  <span className="text-[11px] font-bold text-amber-400">{row.role || 'Student'}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase block">Team ID</label>
                    <input
                      type="text"
                      value={row.teamId || ''}
                      onChange={(e) => handleCellChange(rowIdx, 'teamId', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-cyan-300 font-bold font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase block">Team Name</label>
                    <input
                      type="text"
                      value={row.teamName || ''}
                      onChange={(e) => handleCellChange(rowIdx, 'teamName', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase block">Student Name</label>
                    <input
                      type="text"
                      value={row.studentName || ''}
                      onChange={(e) => handleCellChange(rowIdx, 'studentName', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase block">Roll Number</label>
                    <input
                      type="text"
                      value={row.rollNumber || ''}
                      onChange={(e) => handleCellChange(rowIdx, 'rollNumber', e.target.value.toUpperCase())}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-white uppercase font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase block">Gender</label>
                    <select
                      value={row.gender === 'Female' ? 'F' : (row.gender === 'Male' ? 'M' : (row.gender || 'M'))}
                      onChange={(e) => handleCellChange(rowIdx, 'gender', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-white"
                    >
                      <option value="M">M</option>
                      <option value="F">F</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase block">Branch</label>
                    <input
                      type="text"
                      value={row.branch || ''}
                      onChange={(e) => handleCellChange(rowIdx, 'branch', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          
          /* FULL DESKTOP & TOUCH HORIZONTAL SCROLL GRID */
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto max-h-[600px] touch-pan-x">
              <table className="w-full border-collapse text-xs font-sans min-w-[1200px]">
                <thead>
                  {/* Letter Columns */}
                  <tr className="bg-slate-950 text-slate-500 border-b border-slate-800 select-none">
                    <th className="w-10 p-2 text-center border-r border-slate-800 font-mono text-[10px]">#</th>
                    {COLUMNS.map((col) => (
                      <th key={col.key} className={`${col.width} p-1 text-center border-r border-slate-800 font-mono text-[10px]`}>
                        {col.letter}
                      </th>
                    ))}
                  </tr>

                  {/* Title Headers */}
                  <tr className="bg-slate-800 text-slate-200 border-b border-slate-700 font-bold sticky top-0 z-20">
                    <th className="w-10 p-2 text-center border-r border-slate-700 text-slate-400">No</th>
                    {COLUMNS.map((col) => (
                      <th key={col.key} className={`${col.width} p-2.5 text-left border-r border-slate-700 uppercase tracking-wider text-[11px]`}>
                        {col.name}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filteredData.map((row, rowIdx) => {
                    const isSelectedRow = activeCell.rowIdx === rowIdx;
                    return (
                      <tr 
                        key={row.id || rowIdx}
                        className={`transition-colors ${
                          isSelectedRow ? 'bg-blue-950/40' : rowIdx % 2 === 0 ? 'bg-slate-900/60' : 'bg-slate-950/60'
                        }`}
                      >
                        <td className="w-10 p-2 text-center text-slate-500 font-bold border-r border-slate-800 select-none bg-slate-950/80">
                          {rowIdx + 1}
                        </td>

                        {COLUMNS.map((col) => {
                          const isSelectedCell = activeCell.rowIdx === rowIdx && activeCell.colKey === col.key;
                          const cellVal = row[col.key] || '';

                          return (
                            <td 
                              key={col.key}
                              onClick={() => setActiveCell({ rowIdx, colKey: col.key })}
                              className={`p-0 border-r border-slate-800/80 relative transition-all ${
                                isSelectedCell ? 'ring-2 ring-cyan-400 z-10 bg-slate-900' : 'hover:bg-slate-800/50'
                              }`}
                            >
                              <input
                                type="text"
                                value={cellVal}
                                onChange={(e) => handleCellChange(rowIdx, col.key, e.target.value)}
                                className={`w-full bg-transparent px-2.5 py-2 text-xs focus:outline-none font-medium ${
                                  col.key === 'teamId' ? 'text-cyan-300 font-bold' :
                                  col.key === 'role' && cellVal === 'Leader' ? 'text-amber-400 font-bold' :
                                  col.key === 'gender' && (cellVal === 'F' || cellVal === 'Female') ? 'text-pink-300 font-bold' :
                                  col.key === 'gender' && (cellVal === 'M' || cellVal === 'Male') ? 'text-orange-400 font-bold' :
                                  'text-slate-200'
                                }`}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* GOOGLE SHEET SYNC GUIDE MODAL */}
      {showSyncModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Google Sheet Real-Time Sync</h3>
                  <p className="text-xs text-slate-400">Keep your official Google Sheet updated automatically</p>
                </div>
              </div>
              <button
                onClick={() => setShowSyncModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-lg leading-none"
              >
                ✕
              </button>
            </div>

            {pushResult && (
              <div className={`p-3 rounded-xl text-xs font-semibold flex items-center space-x-2 border ${
                pushResult.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              }`}>
                {pushResult.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                <span>{pushResult.message}</span>
              </div>
            )}

            {/* METHOD 1: 1-Click Formula */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Method 1: Auto-Fetch Formula (Instant Real-time)</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">Recommended</span>
              </div>
              <p className="text-xs text-slate-300">
                1. Open your <a href={GOOGLE_SHEET_URL} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-semibold">Google Sheet ↗</a>.
                <br />
                2. In cell <strong>A1</strong>, paste the formula below:
              </p>
              <div className="flex items-center space-x-2 bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-emerald-300">
                <span className="flex-grow select-all overflow-x-auto text-[11px] sm:text-xs">{IMPORTDATA_FORMULA}</span>
                <button
                  onClick={handleCopyFormula}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded text-[11px] font-bold flex-shrink-0 flex items-center space-x-1"
                >
                  {copiedFormula ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedFormula ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Google Sheets will automatically fetch all registered teams & members directly from this portal and refresh live!
              </p>
            </div>

            {/* METHOD 2: 1-Click Clipboard Paste */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">Method 2: One-Click Copy & Paste</span>
              <p className="text-xs text-slate-300">
                Click <strong>"Copy for Sheets"</strong> in the top toolbar, open cell <strong>A1</strong> in Google Sheet, and press <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-white border border-slate-700">Ctrl + V</kbd>.
              </p>
            </div>

            {/* METHOD 3: Background Webhook Push */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">Method 3: Background Webhook Push</span>
              <p className="text-xs text-slate-300">
                If you added the Google Apps Script Webhook to your sheet, click below to sync all records now:
              </p>
              <button
                onClick={handlePushToGoogleSheet}
                disabled={pushingToSheets}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center space-x-2 transition-colors"
              >
                {pushingToSheets ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>{pushingToSheets ? 'Pushing Data...' : 'Push All Records to Google Sheet Webhook'}</span>
              </button>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <a
                href={GOOGLE_SHEET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5"
              >
                <span>Open Google Sheet ↗</span>
              </a>
              <button
                onClick={() => setShowSyncModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER STATUS BAR */}
      <div className="bg-slate-900 border-t border-slate-800 px-4 sm:px-6 py-2.5 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-4 text-[11px]">
          <span>Rows: <strong className="text-white">{data.length}</strong></span>
          <span>Filtered: <strong className="text-white">{filteredData.length}</strong></span>
          <span className="hidden sm:inline">Active: <strong className="text-cyan-400 font-mono">{activeColObj.letter}{activeCell.rowIdx + 1}</strong></span>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${
            syncStatus.includes('Synced') ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'
          }`}></span>
          <span className="text-[11px] font-semibold text-slate-300">{syncStatus}</span>
        </div>
      </div>

    </div>
  );
};

export default LiveSpreadsheet;
