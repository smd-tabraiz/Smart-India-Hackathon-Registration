import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { 
  Users, CheckCircle2, Edit3, MessageSquare, Printer, LogOut, 
  ShieldAlert, Sparkles, FileText, X, AlertCircle 
} from 'lucide-react';

const Dashboard = () => {
  const { user, team, setTeam, whatsappGroupLink, logout, fetchCurrentUser } = useContext(AuthContext);

  const [editing, setEditing] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [problemStatementId, setProblemStatementId] = useState('');
  const [members, setMembers] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (team) {
      setTeamName(team.teamName);
      setProblemStatementId(team.problemStatementId);
      setMembers(team.members || []);
    }
  }, [team]);

  const handleMemberChange = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;
    if (field === 'isLeader' && value === true) {
      updated.forEach((m, i) => {
        if (i !== index) m.isLeader = false;
      });
    }
    setMembers(updated);
  };

  const handleSaveEdits = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await API.put('/teams/my-team', {
        teamName,
        problemStatementId,
        members,
      });
      setTeam(res.data.team);
      setSuccessMsg('Team details updated successfully!');
      setEditing(false);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update team details.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!team) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="text-center bg-slate-950 p-8 rounded-2xl border border-slate-800 max-w-md">
          <p className="text-slate-400 text-sm mb-4">No registered team found under this leader account.</p>
          <button
            onClick={() => fetchCurrentUser()}
            className="bg-blue-600 px-4 py-2 rounded-xl text-xs font-bold"
          >
            Refresh Dashboard
          </button>
        </div>
      </div>
    );
  }

  const leaderObj = team.members.find((m) => m.isLeader) || team.members[0];
  const femaleCount = team.members.filter((m) => m.gender === 'Female').length;

  return (
    <div className="min-h-screen bg-slate-900 text-white py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header bar */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div>
            <div className="flex items-center space-x-3">
              <span className="bg-cyan-500/20 text-cyan-400 text-xs px-3 py-1 rounded-full font-bold border border-cyan-500/30">
                TEAM ID: {team.teamId}
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full font-bold border border-emerald-500/30">
                {team.registrationStatus.toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-2">{team.teamName}</h1>
            <p className="text-xs text-slate-400 mt-0.5">Problem Statement ID: <strong className="text-cyan-400">{team.problemStatementId}</strong></p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setEditing(!editing)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 border border-slate-700"
            >
              <Edit3 className="w-4 h-4 text-blue-400" />
              <span>{editing ? 'Cancel Editing' : 'Edit Team Details'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 border border-slate-700"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Print Details</span>
            </button>
          </div>
        </div>

        {/* Success / Error notification */}
        {successMsg && (
          <div className="mb-6 bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 p-4 rounded-xl flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/40 text-rose-300 p-4 rounded-xl flex items-center gap-2 text-xs">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* WHATSAPP GROUP EXCLUSIVE BANNER */}
        {whatsappGroupLink && (
          <div className="mb-8 bg-gradient-to-r from-emerald-950/80 to-slate-950 border border-emerald-500/40 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Official Team Leaders WhatsApp Group</h3>
                <p className="text-xs text-slate-400 mt-0.5">Stay updated with internal SIH hackathon evaluation dates & announcements</p>
              </div>
            </div>
            <a
              href={whatsappGroupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-3 rounded-xl shadow transition-colors flex items-center space-x-2"
            >
              <span>Join WhatsApp Group</span>
            </a>
          </div>
        )}

        {/* EDIT FORM MODE OR READONLY MODE */}
        {editing ? (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4">Edit Team Information</h2>
            <form onSubmit={handleSaveEdits} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Team Name</label>
                  <input
                    type="text"
                    required
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Problem Statement ID</label>
                  <input
                    type="text"
                    required
                    value={problemStatementId}
                    onChange={(e) => setProblemStatementId(e.target.value.toUpperCase())}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <h3 className="text-sm font-bold text-cyan-400 pt-4 border-t border-slate-800">Members Details (6 Students)</h3>
              
              <div className="space-y-4">
                {members.map((m, idx) => (
                  <div key={idx} className="bg-slate-900 p-4 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-6 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-slate-400 block mb-1">Name</label>
                      <input
                        type="text"
                        value={m.name}
                        onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Roll No</label>
                      <input
                        type="text"
                        value={m.rollNumber}
                        onChange={(e) => handleMemberChange(idx, 'rollNumber', e.target.value.toUpperCase())}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white uppercase"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Branch</label>
                      <input
                        type="text"
                        value={m.branch}
                        onChange={(e) => handleMemberChange(idx, 'branch', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Gender</label>
                      <select
                        value={m.gender}
                        onChange={(e) => handleMemberChange(idx, 'gender', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Category</label>
                      <select
                        value={m.casteCategory}
                        onChange={(e) => handleMemberChange(idx, 'casteCategory', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white"
                      >
                        <option value="GEN">GEN</option>
                        <option value="EWS">EWS</option>
                        <option value="OC">OC</option>
                        <option value="BC">BC</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="bg-slate-800 px-5 py-2 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl text-xs font-bold"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* READONLY VIEW */
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl print:bg-white print:text-black">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800 print:border-slate-300">
              <h2 className="text-lg font-bold text-white print:text-black">Registered Student Team Members (6)</h2>
              <div className="text-xs text-slate-400 print:text-slate-600">
                Female Members: <strong className="text-emerald-400 print:text-black">{femaleCount} / 1</strong>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-300 print:bg-slate-100 print:text-black border-b border-slate-800">
                    <th className="p-3">#</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Roll Number</th>
                    <th className="p-3">Year</th>
                    <th className="p-3">Branch</th>
                    <th className="p-3">Gender</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                  {team.members.map((m, idx) => (
                    <tr key={idx} className={m.isLeader ? 'bg-blue-950/30 print:bg-blue-50' : ''}>
                      <td className="p-3 font-bold text-slate-400 print:text-slate-700">{idx + 1}</td>
                      <td className="p-3 font-bold text-white print:text-black">{m.name}</td>
                      <td className="p-3 text-cyan-300 print:text-black font-mono">{m.rollNumber}</td>
                      <td className="p-3 text-slate-300 print:text-black">{m.year}</td>
                      <td className="p-3 text-slate-300 print:text-black">{m.branch}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.gender === 'Female' ? 'bg-pink-500/20 text-pink-300 print:text-black' : 'bg-slate-800 text-slate-300 print:text-black'
                        }`}>
                          {m.gender}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300 print:text-black">{m.casteCategory}</td>
                      <td className="p-3">
                        {m.isLeader ? (
                          <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                            Leader
                          </span>
                        ) : (
                          <span className="text-slate-500 print:text-slate-700">Member</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
