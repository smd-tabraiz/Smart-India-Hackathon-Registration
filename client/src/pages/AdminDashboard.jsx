import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { 
  Users, UserCheck, ShieldAlert, Download, Search, Filter, 
  Trash2, Eye, Edit3, RefreshCw, AlertCircle, CheckCircle2, X, FileSpreadsheet 
} from 'lucide-react';

const BRANCHES = ['All Branches', 'CSE', 'CSE - (AI & ML)', 'CSE - (DS)', 'CSBS', 'ECE', 'EEE', 'MECH', 'CIVIL'];
const YEARS = ['All Years', '1st Year', '2nd Year', '3rd Year', '4th Year'];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalTeams: 0,
    totalStudents: 0,
    femaleParticipants: 0,
    registrationsToday: 0,
  });

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [problemStatementFilter, setProblemStatementFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('All Branches');
  const [yearFilter, setYearFilter] = useState('All Years');

  // Modal states
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  
  // Edit team state inside admin
  const [editForm, setEditForm] = useState({
    teamName: '',
    problemStatementId: '',
    registrationStatus: 'registered',
  });

  const fetchStats = async () => {
    try {
      const res = await API.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (problemStatementFilter.trim()) params.problemStatementId = problemStatementFilter.trim();
      if (branchFilter !== 'All Branches') params.branch = branchFilter;
      if (yearFilter !== 'All Years') params.year = yearFilter;

      const res = await API.get('/admin/teams', { params });
      setTeams(res.data);
    } catch (err) {
      console.error('Failed to fetch admin teams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchTeams();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTeams();
  };

  const handleResetFilters = () => {
    setSearch('');
    setProblemStatementFilter('');
    setBranchFilter('All Branches');
    setYearFilter('All Years');
    setTimeout(() => {
      fetchTeams();
    }, 50);
  };

  const handleExportCsv = async () => {
    try {
      const response = await API.get('/admin/export-csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `SIH_2026_Registrations_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to export CSV: ' + (err.message || 'Server error'));
    }
  };

  const handleViewTeam = (team) => {
    setSelectedTeam(team);
    setViewModalOpen(true);
  };

  const handleOpenEdit = (team) => {
    setSelectedTeam(team);
    setEditForm({
      teamName: team.teamName,
      problemStatementId: team.problemStatementId,
      registrationStatus: team.registrationStatus,
    });
    setEditModalOpen(true);
  };

  const handleSaveAdminEdit = async (e) => {
    e.preventDefault();
    const targetId = selectedTeam?._id || selectedTeam?.teamId;
    try {
      await API.put(`/admin/teams/${targetId}`, editForm);
      setEditModalOpen(false);
      await fetchTeams();
      await fetchStats();
    } catch (err) {
      alert('Error updating team: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteTeam = async (id, teamId, name) => {
    if (window.confirm(`Are you sure you want to delete/disqualify Team ${teamId} (${name})? This action cannot be undone.`)) {
      const targetId = id || teamId;
      try {
        await API.delete(`/admin/teams/${targetId}`);
        await fetchTeams();
        await fetchStats();
      } catch (err) {
        alert('Failed to delete team: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header with Club Logos */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Club Logos */}
            <div className="flex items-center space-x-3 bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800 shadow-md shrink-0">
              <div className="text-center">
                <img
                  src="/cc_logo.jpg"
                  alt="Coders' Club"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-contain bg-white p-1 border border-slate-700 shadow-sm"
                />
                <span className="text-[10px] text-slate-400 block font-bold mt-1">Coders' Club</span>
              </div>
              <span className="text-slate-600 font-extrabold text-base">×</span>
              <div className="text-center">
                <img
                  src="/cie_logo.jpg"
                  alt="Centre for Entrepreneurship (CIE)"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-contain bg-white p-1 border border-slate-700 shadow-sm"
                />
                <span className="text-[10px] text-slate-400 block font-bold mt-1">CIE</span>
              </div>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Admin Nomination Control Dashboard</h1>
              <p className="text-xs text-slate-400 mt-1">Managed jointly by <strong className="text-slate-200">Coders Club</strong> & <strong className="text-slate-200">Centre for Entrepreneurship (CIE)</strong></p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={() => { fetchStats(); fetchTeams(); }}
              className="flex-1 md:flex-none bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="flex-1 md:flex-none bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <Link
              to="/spreadsheet"
              className="flex-1 md:flex-none bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/40 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Live Grid & Sync</span>
            </Link>

            <a
              href="https://docs.google.com/spreadsheets/d/1vdoZzJwKesxhg62k0j876eg0H-kUSDJKd-biVDo2dZ8/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Google Sheet ↗</span>
            </a>
          </div>
        </div>

        {/* STATS CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Registered Teams</span>
            <div className="text-3xl font-extrabold text-white mt-2">{stats.totalTeams}</div>
            <span className="text-[11px] text-cyan-400">SIH 2026 Nominated</span>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Students</span>
            <div className="text-3xl font-extrabold text-blue-400 mt-2">{stats.totalStudents}</div>
            <span className="text-[11px] text-slate-500">6 per team</span>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
            <span className="text-xs text-slate-400 font-semibold uppercase">Female Participants</span>
            <div className="text-3xl font-extrabold text-pink-400 mt-2">{stats.femaleParticipants}</div>
            <span className="text-[11px] text-pink-300">Mandatory Rule Satisfied</span>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
            <span className="text-xs text-slate-400 font-semibold uppercase">Registrations Today</span>
            <div className="text-3xl font-extrabold text-amber-400 mt-2">{stats.registrationsToday}</div>
            <span className="text-[11px] text-slate-400">New entries</span>
          </div>
        </div>

        {/* SEARCH AND FILTER BAR */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl mb-8">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Search Input */}
            <div className="lg:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Search Keyword</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Team ID, Team Name, Leader Email, Roll No..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Problem Statement Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Problem Statement ID</label>
              <input
                type="text"
                placeholder="e.g. SIH1234"
                value={problemStatementFilter}
                onChange={(e) => setProblemStatementFilter(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Branch Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Branch</label>
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Year</label>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

          </form>

          <div className="flex items-center justify-end space-x-3 mt-4 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-slate-400 hover:text-white"
            >
              Reset Filters
            </button>
            <button
              type="button"
              onClick={fetchTeams}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center space-x-1.5"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>

        {/* TEAMS DATA TABLE */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Registered Teams ({teams.length})</h3>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">Loading teams data...</div>
          ) : teams.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">No registered teams found matching filters.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-300 border-b border-slate-800">
                    <th className="p-3">Team ID</th>
                    <th className="p-3">Team Name</th>
                    <th className="p-3">PS ID</th>
                    <th className="p-3">Leader Email</th>
                    <th className="p-3">Females</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {teams.map((t) => {
                    const females = t.members.filter((m) => m.gender === 'Female' || m.gender === 'F').length;
                    return (
                      <tr key={t._id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3 font-mono font-bold text-cyan-400">{t.teamId}</td>
                        <td className="p-3 font-bold text-white">{t.teamName}</td>
                        <td className="p-3 font-mono text-slate-300">{t.problemStatementId}</td>
                        <td className="p-3 text-slate-300">{t.leaderEmail}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            females >= 1 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                          }`}>
                            {females} / 1
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                            t.registrationStatus === 'registered' ? 'bg-blue-500/20 text-blue-300' : 'bg-rose-500/20 text-rose-300'
                          }`}>
                            {t.registrationStatus}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => handleViewTeam(t)}
                            title="View Full Team Details"
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleOpenEdit(t)}
                            title="Edit Team Info"
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteTeam(t._id, t.teamId, t.teamName)}
                            title="Delete/Disqualify Team"
                            className="p-1.5 bg-slate-800 hover:bg-rose-900/50 text-rose-400 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* VIEW TEAM MODAL */}
        {viewModalOpen && selectedTeam && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto relative">
              <button
                onClick={() => setViewModalOpen(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 mb-4">
                <span className="bg-cyan-500/20 text-cyan-400 text-xs px-3 py-1 rounded-full font-bold">
                  {selectedTeam.teamId}
                </span>
                <h3 className="text-xl font-bold text-white">{selectedTeam.teamName}</h3>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl mb-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div><span className="text-slate-400">Problem Statement ID:</span> <strong className="text-cyan-300 block">{selectedTeam.problemStatementId}</strong></div>
                <div><span className="text-slate-400">Leader Email:</span> <strong className="text-white block">{selectedTeam.leaderEmail}</strong></div>
                <div><span className="text-slate-400">Registered Date:</span> <strong className="text-slate-200 block">{new Date(selectedTeam.createdAt).toLocaleDateString()}</strong></div>
              </div>

              <h4 className="font-bold text-sm text-white mb-2">Members (6 Students)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-slate-300">
                      <th className="p-2">#</th>
                      <th className="p-2">Name</th>
                      <th className="p-2">Roll No</th>
                      <th className="p-2">Year</th>
                      <th className="p-2">Branch</th>
                      <th className="p-2">Gender</th>
                      <th className="p-2">Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {selectedTeam.members.map((m, idx) => (
                      <tr key={idx}>
                        <td className="p-2 text-slate-500 font-bold">{idx + 1}</td>
                        <td className="p-2 font-bold text-white">{m.name} {m.isLeader && '(Leader)'}</td>
                        <td className="p-2 text-cyan-300 font-mono">{m.rollNumber}</td>
                        <td className="p-2">{m.year}</td>
                        <td className="p-2">{m.branch}</td>
                        <td className="p-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            (m.gender === 'F' || m.gender === 'Female') 
                              ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' 
                              : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                          }`}>
                            {m.gender === 'Female' ? 'F' : (m.gender === 'Male' ? 'M' : m.gender)}
                          </span>
                        </td>
                        <td className="p-2">{m.casteCategory}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="bg-slate-800 px-5 py-2 rounded-xl text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT TEAM MODAL */}
        {editModalOpen && selectedTeam && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-lg w-full p-6 relative">
              <button
                onClick={() => setEditModalOpen(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-bold text-white mb-4">Edit Team ({selectedTeam.teamId})</h3>

              <form onSubmit={handleSaveAdminEdit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Team Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.teamName}
                    onChange={(e) => setEditForm({ ...editForm, teamName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Problem Statement ID</label>
                  <input
                    type="text"
                    required
                    value={editForm.problemStatementId}
                    onChange={(e) => setEditForm({ ...editForm, problemStatementId: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white uppercase"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Registration Status</label>
                  <select
                    value={editForm.registrationStatus}
                    onChange={(e) => setEditForm({ ...editForm, registrationStatus: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="registered">Registered</option>
                    <option value="disqualified">Disqualified</option>
                  </select>
                </div>

                <div className="pt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="bg-slate-800 px-4 py-2 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-xl"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
