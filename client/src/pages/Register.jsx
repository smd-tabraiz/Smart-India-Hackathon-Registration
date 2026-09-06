import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { 
  Users, UserCheck, ShieldAlert, CheckCircle2, ArrowRight, ArrowLeft, 
  Sparkles, MessageSquare, Lock, Mail, FileText, AlertCircle 
} from 'lucide-react';

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const BRANCHES = ['CSE', 'CSE - (AI & ML)', 'CSE - (DS)', 'CSBS', 'ECE', 'EEE', 'MECH', 'CIVIL'];
const GENDERS = ['M', 'F'];
const CATEGORIES = ['GEN', 'EWS', 'OC', 'BC', 'SC', 'ST'];

const initialMemberState = (idx) => ({
  name: '',
  email: '',
  mobileNumber: '',
  rollNumber: '',
  year: '3rd Year',
  branch: 'CSE',
  gender: idx === 0 ? 'F' : 'M', // Default to 1 female member for user convenience
  casteCategory: 'GEN',
  isLeader: idx === 0, // First member is default leader
});

const Register = () => {
  const { setAuthDataAfterRegister } = useContext(AuthContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const topErrorRef = useRef(null);
  const bottomErrorRef = useRef(null);

  const scrollToError = () => {
    setTimeout(() => {
      if (bottomErrorRef.current) {
        bottomErrorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (topErrorRef.current) {
        topErrorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 80);
  };

  // Step 1 State
  const [teamName, setTeamName] = useState('');
  const [problemStatementId, setProblemStatementId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2 State - Exactly 6 Members
  const [members, setMembers] = useState(
    Array.from({ length: 6 }, (_, idx) => initialMemberState(idx))
  );

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);

  // Female count live calculation
  const femaleCount = members.filter((m) => m.gender === 'F' || m.gender === 'Female').length;

  const handleMemberChange = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;

    // If changing isLeader, uncheck leader for other members
    if (field === 'isLeader' && value === true) {
      updated.forEach((m, i) => {
        if (i !== index) m.isLeader = false;
      });
    }
    setMembers(updated);
  };

  // Step 1 Validation
  const validateStep1 = () => {
    setErrorMsg('');
    if (!teamName.trim()) return 'Please enter Team Name.';
    if (!problemStatementId.trim()) return 'Please enter Problem Statement ID.';
    if (!email.trim() || !email.includes('@')) return 'Please enter a valid Team Leader Email address.';
    if (!password || password.length < 6) return 'Password must be at least 6 characters long.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    setErrorMsg('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneClean = (val) => String(val || '').replace(/\D/g, '');

    for (let i = 0; i < 6; i++) {
      const m = members[i];
      if (!m.name.trim()) return `Member #${i + 1}: Name is required.`;
      if (!m.email || !m.email.trim()) return `Member #${i + 1}: Email ID is required.`;
      if (!emailRegex.test(m.email.trim())) return `Member #${i + 1}: Please enter a valid Email ID (e.g. student@gmail.com).`;
      
      const cleanDigits = phoneClean(m.mobileNumber);
      if (!m.mobileNumber || !m.mobileNumber.trim()) return `Member #${i + 1}: Mobile Number is required.`;
      if (cleanDigits.length !== 10) return `Member #${i + 1}: Please enter a valid 10-digit Mobile Number.`;

      if (!m.rollNumber.trim()) return `Member #${i + 1}: Roll Number is required.`;
      if (!m.year) return `Member #${i + 1}: Year is required.`;
      if (!m.branch) return `Member #${i + 1}: Branch is required.`;
      if (!m.gender) return `Member #${i + 1}: Gender is required.`;
      if (!m.casteCategory) return `Member #${i + 1}: Category is required.`;
    }

    if (femaleCount < 1) {
      return 'Mandatory Rule: At least ONE female student must be present in your team of 6.';
    }

    const leaders = members.filter((m) => m.isLeader);
    if (leaders.length !== 1) {
      return 'Exactly ONE team member must be designated as the Team Leader.';
    }

    // Check duplicate roll numbers within team
    const rolls = members.map((m) => m.rollNumber.trim().toUpperCase());
    const uniqueRolls = new Set(rolls);
    if (uniqueRolls.size !== 6) {
      return 'Duplicate Roll Numbers found inside team. Each student must have a unique Roll Number.';
    }

    // Check duplicate emails within team
    const emails = members.map((m) => (m.email || '').trim().toLowerCase());
    const uniqueEmails = new Set(emails);
    if (uniqueEmails.size !== 6) {
      return 'Duplicate Email IDs found inside team. Each student must have a unique Email ID.';
    }

    // Check duplicate mobile numbers within team
    const phones = members.map((m) => phoneClean(m.mobileNumber));
    const uniquePhones = new Set(phones);
    if (uniquePhones.size !== 6) {
      return 'Duplicate Mobile Numbers found inside team. Each student must have a unique Mobile Number.';
    }

    return null;
  };

  const handleNextStep1 = (e) => {
    e.preventDefault();
    const err = validateStep1();
    if (err) {
      setErrorMsg(err);
      scrollToError();
      return;
    }
    setErrorMsg('');
    // Auto-populate leader email into member 0 if empty
    setMembers((prev) => {
      const updated = [...prev];
      if (updated[0].isLeader && !updated[0].email) {
        updated[0].email = email.trim().toLowerCase();
      }
      return updated;
    });
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextStep2 = (e) => {
    e.preventDefault();
    const err = validateStep2();
    if (err) {
      setErrorMsg(err);
      scrollToError();
      return;
    }
    setErrorMsg('');
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitRegistration = async () => {
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await API.post('/teams/register', {
        email,
        password,
        teamName,
        problemStatementId,
        members,
      });

      setSuccessData(res.data);
      setAuthDataAfterRegister(
        res.data.token,
        res.data.user,
        res.data.team,
        res.data.whatsappGroupLink
      );
      setStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || 'Registration failed. Please check backend connection and try again.'
      );
      scrollToError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Step Indicator Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-3">
            <span className={step >= 1 ? 'text-blue-400 font-bold' : ''}>Step 1: Team Info</span>
            <span className={step >= 2 ? 'text-blue-400 font-bold' : ''}>Step 2: Six Members</span>
            <span className={step >= 3 ? 'text-blue-400 font-bold' : ''}>Step 3: Review</span>
            <span className={step === 4 ? 'text-cyan-400 font-bold' : ''}>Step 4: Success</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMsg && (
          <div ref={topErrorRef} className="mb-6 bg-rose-500/15 border-2 border-rose-500/50 text-rose-300 p-4 rounded-xl flex items-start gap-3 text-sm shadow-xl animate-pulse">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block text-rose-200 font-bold mb-0.5">Please correct the following:</strong>
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        {/* STEP 1: TEAM & ACCOUNT INFORMATION */}
        {step === 1 && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Step 1: Team & Account Info</h2>
                <p className="text-xs text-slate-400">Enter basic team details and create Leader login account</p>
              </div>
            </div>

            <form onSubmit={handleNextStep1} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Team Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CyberKnights"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Problem Statement ID *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SIH1234 or PS-102"
                  value={problemStatementId}
                  onChange={(e) => setProblemStatementId(e.target.value.toUpperCase())}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white uppercase placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <h3 className="text-sm font-bold text-cyan-400 mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Team Leader Login Account
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Team Leader Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="leader@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Confirm Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg shadow-blue-600/20"
                >
                  <span>Continue to Step 2</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: SIX MEMBERS FORM */}
        {step === 2 && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-cyan-600/20 text-cyan-400 rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Step 2: Team Members (Exactly 6)</h2>
                  <p className="text-xs text-slate-400">Fill details for all 6 team members</p>
                </div>
              </div>

              {/* LIVE FEMALE COUNTER INDICATOR */}
              <div className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 border ${
                femaleCount >= 1 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
              }`}>
                <span>Female Members:</span>
                <span className="text-base font-extrabold">{femaleCount} / 1</span>
                {femaleCount >= 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-rose-400" />}
              </div>
            </div>

            <form onSubmit={handleNextStep2} className="space-y-8">
              {members.map((m, idx) => (
                <div 
                  key={idx} 
                  className={`p-5 rounded-2xl border transition-all ${
                    m.isLeader 
                      ? 'bg-blue-950/40 border-blue-500/60' 
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="w-7 h-7 rounded-full bg-slate-800 text-slate-200 text-xs font-bold flex items-center justify-center border border-slate-700">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-slate-200 text-sm">
                        Member #{idx + 1} {m.isLeader && <span className="text-xs text-blue-400 font-extrabold ml-1">(TEAM LEADER)</span>}
                      </h4>
                    </div>

                    <label className="flex items-center space-x-2 cursor-pointer text-xs font-semibold text-slate-300">
                      <input
                        type="checkbox"
                        checked={m.isLeader}
                        onChange={(e) => handleMemberChange(idx, 'isLeader', e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700 focus:ring-blue-500"
                      />
                      <span>Set as Team Leader</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Student Name"
                        value={m.name}
                        onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Email ID *</label>
                      <input
                        type="email"
                        required
                        placeholder={m.isLeader ? (email || "leader@gmail.com") : `member${idx + 1}@gmail.com`}
                        value={m.email}
                        onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9876543210"
                        value={m.mobileNumber || ''}
                        onChange={(e) => handleMemberChange(idx, 'mobileNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Roll Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="21XXXXXX"
                        value={m.rollNumber}
                        onChange={(e) => handleMemberChange(idx, 'rollNumber', e.target.value.toUpperCase())}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white uppercase placeholder-slate-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Year *</label>
                      <select
                        value={m.year}
                        onChange={(e) => handleMemberChange(idx, 'year', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        {YEARS.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Branch *</label>
                      <select
                        value={m.branch}
                        onChange={(e) => handleMemberChange(idx, 'branch', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        {BRANCHES.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Gender *</label>
                      <select
                        value={m.gender}
                        onChange={(e) => handleMemberChange(idx, 'gender', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        {GENDERS.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Caste Category *</label>
                      <select
                        value={m.casteCategory}
                        onChange={(e) => handleMemberChange(idx, 'casteCategory', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              {/* Error Alert right above Review button */}
              {errorMsg && (
                <div ref={bottomErrorRef} className="mt-4 bg-rose-500/15 border-2 border-rose-500/60 text-rose-300 p-4 rounded-xl flex items-start gap-3 text-sm shadow-xl animate-pulse">
                  <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-rose-200 font-bold mb-0.5">Please fix this issue before proceeding to Review:</strong>
                    <span>{errorMsg}</span>
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-5 py-2.5 rounded-xl flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg shadow-blue-600/20"
                >
                  <span>Review Team Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: REVIEW BEFORE SUBMIT */}
        {step === 3 && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-2">Step 3: Review Registration Details</h2>
            <p className="text-xs text-slate-400 mb-6">Please verify all information carefully before final submission.</p>

            {/* Team summary box */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Team Name:</span>
                <span className="font-bold text-white text-sm">{teamName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Problem Statement ID:</span>
                <span className="font-bold text-cyan-400 text-sm">{problemStatementId}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Leader Email:</span>
                <span className="font-bold text-white text-sm">{email}</span>
              </div>
            </div>

            {/* Table of 6 members */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-300 border-b border-slate-800">
                    <th className="p-3">#</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email ID</th>
                    <th className="p-3">Mobile No</th>
                    <th className="p-3">Roll No</th>
                    <th className="p-3">Year</th>
                    <th className="p-3">Branch</th>
                    <th className="p-3">Gender</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {members.map((m, idx) => (
                    <tr key={idx} className={m.isLeader ? 'bg-blue-950/20' : 'bg-slate-950'}>
                      <td className="p-3 text-slate-500 font-bold">{idx + 1}</td>
                      <td className="p-3 font-semibold text-white">{m.name}</td>
                      <td className="p-3 text-slate-300 font-mono text-[11px]">{m.email}</td>
                      <td className="p-3 text-cyan-300 font-mono text-[11px]">{m.mobileNumber}</td>
                      <td className="p-3 text-slate-200 font-mono">{m.rollNumber}</td>
                      <td className="p-3 text-slate-300">{m.year}</td>
                      <td className="p-3 text-slate-300">{m.branch}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          (m.gender === 'F' || m.gender === 'Female') 
                            ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' 
                            : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                        }`}>
                          {m.gender === 'Female' ? 'F' : (m.gender === 'Male' ? 'M' : m.gender)}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300">{m.casteCategory}</td>
                      <td className="p-3">
                        {m.isLeader ? (
                          <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                            Leader
                          </span>
                        ) : (
                          <span className="text-slate-500">Member</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Error banner in Step 3 */}
            {errorMsg && (
              <div ref={bottomErrorRef} className="my-4 bg-rose-500/15 border-2 border-rose-500/60 text-rose-300 p-4 rounded-xl flex items-start gap-3 text-sm shadow-xl">
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-rose-200 font-bold mb-0.5">Registration Error:</strong>
                  <span>{errorMsg}</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => { setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-5 py-2.5 rounded-xl flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Edit Members</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleSubmitRegistration}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold px-8 py-3 rounded-xl flex items-center space-x-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                {loading ? (
                  <span>Submitting Registration...</span>
                ) : (
                  <>
                    <span>Confirm & Register Team</span>
                    <CheckCircle2 className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS PAGE */}
        {step === 4 && successData && (
          <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-8 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Registration Successful!</h2>
            <p className="text-slate-400 text-xs mt-1">Your team has been registered for SIH 2026</p>

            {/* Generated Server Team ID Box */}
            <div className="my-6 bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md mx-auto">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Your Generated Server Team ID</span>
              <div className="text-3xl font-extrabold text-cyan-400 tracking-wider my-2 font-mono">
                {successData.teamId}
              </div>
              <p className="text-[11px] text-slate-400">Save this Team ID for all future references.</p>
            </div>

            {/* Email Notification Details & Online Viewer */}
            <div className="my-6 p-4 bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md mx-auto text-left">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-200">Confirmation Email</p>
                  <p className="text-[12px] text-slate-400 mt-0.5">
                    Notification dispatched to Team Leader: <strong className="text-cyan-400">{successData.user?.email || email}</strong>
                  </p>
                  {successData.emailPreviewUrl && (
                    <div className="mt-3">
                      <a
                        href={successData.emailPreviewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-xs font-bold text-cyan-300 hover:text-cyan-200 bg-cyan-950/70 border border-cyan-500/40 px-3.5 py-2 rounded-xl transition-all shadow-sm"
                      >
                        <span>📨 Open Official Email Confirmation Slip</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Exclusive WhatsApp Link Button */}
            {successData.whatsappGroupLink && (
              <div className="my-6 p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl max-w-md mx-auto">
                <p className="text-xs font-semibold text-emerald-300 mb-3">
                  💬 Official Team Leaders WhatsApp Group:
                </p>
                <a
                  href={successData.whatsappGroupLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-colors text-sm"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Join SIH 2026 WhatsApp Group</span>
                </a>
              </div>
            )}

            <div className="pt-4 flex items-center justify-center space-x-4">
              <Link
                to="/dashboard"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm"
              >
                Go to Team Dashboard
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Register;
