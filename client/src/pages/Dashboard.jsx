import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { MessageSquare, Printer } from 'lucide-react';

const Dashboard = () => {
  const { team, whatsappGroupLink, fetchCurrentUser } = useContext(AuthContext);

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
  const femaleCount = team.members.filter((m) => m.gender === 'F' || m.gender === 'Female').length;

  return (
    <div className="min-h-screen bg-slate-900 text-white py-10 print:py-0 print:m-0 print:bg-white print:text-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 print:max-w-none print:p-0 print:m-0">
        
        {/* Header bar with Club Logos */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl print:hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Both Club Logos */}
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
              <div className="flex items-center space-x-3">
                <span className="bg-cyan-500/20 text-cyan-400 text-xs px-3 py-1 rounded-full font-bold border border-cyan-500/30 font-mono">
                  TEAM ID: {team.teamId}
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full font-bold border border-emerald-500/30">
                  {team.registrationStatus.toUpperCase()}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-white mt-2">{team.teamName}</h1>
              <p className="text-xs text-slate-400 mt-0.5">Problem Statement ID: <strong className="text-cyan-400">{team.problemStatementId}</strong></p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handlePrint}
              className="w-full md:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 border border-slate-700 transition-colors"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Print Details</span>
            </button>
          </div>
        </div>

        {/* WHATSAPP GROUP EXCLUSIVE BANNER */}
        {whatsappGroupLink && (
          <div className="mb-8 bg-gradient-to-r from-emerald-950/80 to-slate-950 border border-emerald-500/40 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg print:hidden">
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

        {/* REGISTERED MEMBERS TABLE */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl print:bg-white print:text-black print:p-0 print:border-none print:shadow-none print:m-0">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800 print:hidden">
            <h2 className="text-lg font-bold text-white print:text-black">Registered Student Team Members (6)</h2>
            <div className="text-xs text-slate-400 print:text-slate-600">
              Female Members: <strong className="text-emerald-400 print:text-black">{femaleCount} / 1</strong>
            </div>
          </div>

          <div className="overflow-x-auto print:overflow-visible">
            <table className="w-full text-left text-xs border-collapse print:text-xs print:border print:border-slate-300">
              <thead className="print:table-header-group">
                <tr className="bg-slate-900 text-slate-300 print:bg-slate-100 print:text-black border-b border-slate-800 print:border-b print:border-slate-300">
                  <th className="p-3 print:p-2.5 print:border print:border-slate-300 print:font-bold">#</th>
                  <th className="p-3 print:p-2.5 print:border print:border-slate-300 print:font-bold">Name</th>
                  <th className="p-3 print:p-2.5 print:border print:border-slate-300 print:font-bold">Email</th>
                  <th className="p-3 print:p-2.5 print:border print:border-slate-300 print:font-bold">Roll Number</th>
                  <th className="p-3 print:p-2.5 print:border print:border-slate-300 print:font-bold">Year</th>
                  <th className="p-3 print:p-2.5 print:border print:border-slate-300 print:font-bold">Branch</th>
                  <th className="p-3 print:p-2.5 print:border print:border-slate-300 print:font-bold">Gender</th>
                  <th className="p-3 print:p-2.5 print:border print:border-slate-300 print:font-bold">Category</th>
                  <th className="p-3 print:p-2.5 print:border print:border-slate-300 print:font-bold">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-300">
                {team.members.map((m, idx) => (
                  <tr key={idx} className={m.isLeader ? 'bg-blue-950/30 print:bg-blue-50/50' : ''}>
                    <td className="p-3 print:p-2 print:border print:border-slate-300 font-bold text-slate-400 print:text-slate-800">{idx + 1}</td>
                    <td className="p-3 print:p-2 print:border print:border-slate-300 font-bold text-white print:text-slate-900">{m.name}</td>
                    <td className="p-3 print:p-2 print:border print:border-slate-300 text-slate-300 print:text-slate-800 font-mono text-[11px]">{m.email || (m.isLeader ? team.leaderEmail : '-')}</td>
                    <td className="p-3 print:p-2 print:border print:border-slate-300 text-cyan-300 print:text-black font-mono font-bold">{m.rollNumber}</td>
                    <td className="p-3 print:p-2 print:border print:border-slate-300 text-slate-300 print:text-slate-800">{m.year}</td>
                    <td className="p-3 print:p-2 print:border print:border-slate-300 text-slate-300 print:text-slate-800">{m.branch}</td>
                    <td className="p-3 print:p-2 print:border print:border-slate-300">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        (m.gender === 'F' || m.gender === 'Female') 
                          ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30 print:bg-pink-100 print:text-pink-800 print:border-pink-300' 
                          : 'bg-orange-500/20 text-orange-300 border border-orange-500/30 print:bg-orange-100 print:text-orange-800 print:border-orange-300'
                      }`}>
                        {m.gender === 'Female' ? 'F' : (m.gender === 'Male' ? 'M' : m.gender)}
                      </span>
                    </td>
                    <td className="p-3 print:p-2 print:border print:border-slate-300 text-slate-300 print:text-slate-800">{m.casteCategory}</td>
                    <td className="p-3 print:p-2 print:border print:border-slate-300">
                      {m.isLeader ? (
                        <span className="bg-blue-600 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold print:bg-blue-600 print:text-white">
                          Leader
                        </span>
                      ) : (
                        <span className="text-slate-500 print:text-slate-700 font-medium">Member</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
